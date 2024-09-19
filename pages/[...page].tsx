import React from "react";
import { useRouter } from "next/router";
import { BuilderComponent, builder, BuilderContent } from "@builder.io/react";
import DefaultErrorPage from "next/error";
import Head from "next/head";
import { GetStaticProps, GetStaticPaths } from "next";
import "../src/builder-registry";

// Initialize Builder.io with the API key
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY!);

// Fetch the Builder content for a given page
export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const urlPath = "/" + ((params?.page as string[])?.join("/") || "");
    console.log('Fetching content for URL path:', urlPath);

    // Fetch the builder content for the given page
    const page = await builder
      .get("page", {
        userAttributes: {
          urlPath: urlPath,
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

// Generate the static paths for all pages in Builder
export const getStaticPaths: GetStaticPaths = async () => {
  try {
    // Get a list of all pages in Builder
    const pages = await builder.getAll("page", {
      // We only need the URL field
      fields: "data.url",
      options: { noTargeting: true },
    });

    // Generate the static paths for all pages in Builder
    const paths = pages
      .map((page) => {
        const url = page.data?.url;
        return url ? { params: { page: url.split('/').filter(Boolean) } } : null;
      })
      .filter((path): path is { params: { page: string[] } } => path !== null); // Ensure no null values

    console.log('Generated static paths:', paths);

    return {
      paths,
      fallback: "blocking",
    };
  } catch (error) {
    console.error('Error fetching Builder paths:', error);
    return {
      paths: [],
      fallback: "blocking",
    };
  }
};

interface PageProps {
  page: BuilderContent | null;
}

const Page: React.FC<PageProps> = ({ page }) => {
  if (!page) {
    return <DefaultErrorPage statusCode={404} />;
  }

  const pageTitle = (page.data as any)?.title || "Default Title";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <BuilderComponent model="page" />
    </>
  );
};

export default Page;
