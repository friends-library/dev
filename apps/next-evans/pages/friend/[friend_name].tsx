import { PrismaClient } from '@prisma/client';
import type { GetStaticPaths, GetStaticProps } from 'next';
import FriendBlock from '@/components/friend/FriendBlock';
import FeaturedQuoteBlock from '@/components/friend/FeaturedQuoteBlock';

const prisma = new PrismaClient();

export const getStaticPaths: GetStaticPaths = async () => {
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
  if (typeof context.params?.friend_name !== `string`) {
    return {
      notFound: true,
    };
  }
  const friend = await prisma.friends.findFirst({
    where: { slug: context.params.friend_name },
  });
  if (!friend) {
    return {
      notFound: true,
    };
  }
  const friendQuote = await prisma.friend_quotes.findFirst({
    where: { friend_id: friend.id },
  });
  if (!friendQuote) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      name: friend.name,
      gender: friend.gender,
      blurb: friend.description,
      quote: friendQuote.text,
      quoteCite: friendQuote.source,
    },
  };
};

interface Props {
  name: string;
  gender: 'male' | 'female' | 'mixed';
  blurb: string;
  quote: string;
  quoteCite: string;
}

const Friend: React.FC<Props> = ({ name, gender, blurb, quote, quoteCite }) => {
  return (
    <div>
      <FriendBlock name={name} gender={gender} blurb={blurb} />
      <FeaturedQuoteBlock cite={quoteCite} quote={quote} />
    </div>
  );
};

export default Friend;
