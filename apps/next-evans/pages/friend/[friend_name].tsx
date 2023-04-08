import { PrismaClient } from '@prisma/client';
import type { GetStaticPaths, GetStaticProps } from 'next';
import FeaturedQuoteBlock from '@/components/pages/friend/FeaturedQuoteBlock';
import FriendBlock from '@/components/pages/friend/FriendBlock';

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
  return {
    props: {
      name: friend.name,
      gender: friend.gender,
      blurb: friend.description,
      quote: friendQuote && {
        text: friendQuote.text,
        cite: friendQuote.source,
      },
    },
  };
};

interface Props {
  name: string;
  gender: 'male' | 'female' | 'mixed';
  blurb: string;
  quote: { text: string; cite: string } | null;
}

const Friend: React.FC<Props> = ({ name, gender, blurb, quote }) => {
  return (
    <div>
      <FriendBlock name={name} gender={gender} blurb={blurb} />
      {quote && <FeaturedQuoteBlock cite={quote.cite} quote={quote.text} />}
    </div>
  );
};

export default Friend;
