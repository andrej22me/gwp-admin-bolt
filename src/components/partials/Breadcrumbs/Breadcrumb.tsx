import Link from "next/link";

interface BreadcrumbPage {
    name: string;
    url: string;
}

interface BreadcrumbProps {
  pageName: string;
  pageList?: BreadcrumbPage[]
}
const Breadcrumb = ({ pageName, pageList }: BreadcrumbProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        {pageName}
      </h2>

      <nav>
        <ol className="flex items-center gap-2">
            {
                pageList ? (
                    pageList?.map((page, index) => (
                        <li key={index}>
                            <Link className="font-medium" href={page.url}>
                                {page.name} <span className={index === pageList.length - 1 ? 'hidden' :' '}>/</span>
                            </Link>
                        </li>
                    ))
                ): (
                    <>
                        <li>
                            <Link className="font-medium" href="/">
                                Dashboard /
                            </Link>
                        </li>
                        <li className="font-medium text-primary">{pageName}</li>
                    </>
                )
            }
        </ol>
      </nav>
    </div>
  )
      ;
};

export default Breadcrumb;
