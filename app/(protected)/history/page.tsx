import History from "@/components/Home/History";

// import { useSearchParams } from "next/navigation";

type HistoryPageProps = {
  searchParams: Promise<{ id: string }>;
};
const HistoryPage = async ({ searchParams }: HistoryPageProps) => {
  const params = await searchParams;
  const ID = params.id;

  return (
    <div>
      <div className="mt-10">
        <div className="h-72 mt-50">
          <History></History>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
