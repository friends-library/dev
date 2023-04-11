import { PrismaClient } from '@prisma/client';
import type { GetStaticPaths, GetStaticProps } from 'next';
import type { Lang } from '@/../../libs-ts/types/src';
import FeaturedQuoteBlock from '@/components/pages/friend/FeaturedQuoteBlock';
import FriendBlock from '@/components/pages/friend/FriendBlock';
import TestimonialsBlock from '@/components/pages/friend/TestimonialsBlock';

export const getStaticPaths: GetStaticPaths = async () => {
  const prisma = new PrismaClient();
  const allFriends = await prisma.friends.findMany();
  const paths = allFriends.map((friend) => ({
    params: {
      friend_name: friend.slug,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const prisma = new PrismaClient();
  if (typeof context.params?.friend_name !== `string`) {
    return {
      notFound: true,
    };
  }
  const friend = await prisma.friends.findFirst({
    where: {
      slug: context.params.friend_name,
      lang: process.env.NEXT_PUBLIC_LANG as Lang,
    },
    select: {
      name: true,
      gender: true,
      description: true,
      friend_quotes: {
        select: {
          text: true,
          source: true,
        },
      },
    },
  });
  if (!friend) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      ...friend,
      quotes: friend.friend_quotes.map((q) => ({ quote: q.text, cite: q.source })),
    },
  };
};

interface Props {
  name: string;
  gender: 'male' | 'female' | 'mixed';
  description: string;
  quotes: Array<{ quote: string; cite: string }>;
}

const Friend: React.FC<Props> = ({ name, gender, description, quotes }) => {
  return (
    <div>
      <FriendBlock name={name} gender={gender} blurb={description} />
      {quotes[0] && <FeaturedQuoteBlock cite={quotes[0].cite} quote={quotes[0].quote} />}
      <TestimonialsBlock testimonials={quotes.slice(1, quotes.length)} />
    </div>
  );
};

export default Friend;
