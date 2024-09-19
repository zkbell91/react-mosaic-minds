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
builder.init(apiKey as string);

// Define a function that fetches the Builder content for the given page
export const getStaticProps: GetStaticProps = async () => {
  try {
    // Fetch the builder content for the given page
    const page = await builder
      .get('page', {
        userAttributes: {
          urlPath: '/test-page',
        },
      })
      .toPromise();

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

interface TestPageProps {
  page: BuilderContentType | null;
}

// Utility function to filter out unwanted props
const filterProps = (props: any) => {
  const { fetchPriority, ...rest } = props;
  return rest;
};

// Custom Image component to handle fetchPriority prop
const CustomImage = (props: any) => {
  return <img {...filterProps(props)} />;
};

const TestPage: React.FC<TestPageProps> = ({ page }) => {
  if (!page) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <>
      <Head>
        <title>Test Page</title>
      </Head>
      <BuilderComponent model="page" content={page} />
    </>
  );
};

export default TestPage;
