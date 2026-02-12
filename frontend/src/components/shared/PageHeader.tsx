type PageHeaderProps = {
    title: string;
    description: string;
  };
  
  export default function PageHeader({ title, description }: PageHeaderProps) {
    return (
      <div className="one8-page-header">
        <h1 className="one8-page-title">{title}</h1>
        <p className="one8-page-description">{description}</p>
      </div>
    );
  }