import React from 'react';
import { BuilderComponent, builder } from '@builder.io/react';

builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY);

const CustomLink = (props) => {
  return <a {...props} />;
};

const BuilderContent = ({ model, content }) => {
  return (
    <BuilderComponent
      model={model}
      content={content}
      renderLink={(props) => <CustomLink {...props} />}
    />
  );
};

const Your404Page = () => {
  return <div>Page Not Found</div>;
};

const NotFoundPage = () => {
  if (Builder.isPreviewing || Builder.isEditing) {
    return <BuilderComponent model="page" />;
  }

  return <Your404Page />;
};

export default NotFoundPage;
export { BuilderContent };
