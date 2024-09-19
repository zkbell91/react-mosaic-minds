import React from 'react';
import { useRouter } from 'next/router';
import { BuilderComponent, builder, useIsPreviewing } from '@builder.io/react';
import { BuilderContent as BuilderContentType } from '@builder.io/sdk';
import DefaultErrorPage from 'next/error';
import Head from 'next/head';
import { GetStaticProps } from 'next';

// Initialize Builder.io with your API key from environment variable
const apiKey = process.env.NEXT_PUBLIC_BUILDER_API_KEY;
if (!apiKey) {
  throw new Error('NEXT_PUBLIC_BUILDER_API_KEY is not defined');
}
console.log('Builder API Key:', apiKey);
builder.init(apiKey as string);

// Define a function that fetches the Builder content for the given page
export const getStaticProps: GetStaticProps = async () => {
  try {
    // Fetch the builder content for the given page
    const page = await builder
      .get('page', {
        userAttributes: {
          urlPath: '/',
        },
      })
      .toPromise();

    console.log('Fetched page content:', page);

    // Return the page content as props
    return {
      props: {
        page: page || null,
      },
      // Revalidate the content every 5 seconds
      revalidate: 5,
    };
  } catch (error) {
    console.error('Error fetching Builder content:', error);
    return {
      props: {
        page: null,
      },
    };
  }
};

interface HomePageProps {
  page: BuilderContentType | null;
}

const HomePage: React.FC<HomePageProps> = ({ page }) => {
  if (!page) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <>
      <Head>
        <title>Home Page</title>
      </Head>
      <BuilderComponent model="page" content={page} />
    </>
  );
};

export default HomePage;
