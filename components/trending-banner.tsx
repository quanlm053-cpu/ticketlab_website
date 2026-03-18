import { Search } from "lucide-react";

export function TrendingBanner() {
  return (
    <>
      {/* Search bar section */}
      <div className="flex items-center justify-center bg-[#f0f5f0] py-6">
        <button className="flex items-center gap-2 text-[#666666] transition-colors hover:text-[#2d5f5d]">
          <Search className="h-5 w-5" />
        </button>
      </div>

      {/* Trending text banner */}
      <div className="bg-[#d4e8d4] py-10 text-center">
        <h2
          className="text-3xl text-[#2d5f5d] lg:text-5xl"
          style={{ fontFamily: "var(--font-dancing)" }}
        >
          {'S\u1EF1 ki\u1EC7n xu h\u01B0\u1EDBng!'}
        </h2>
      </div>
    </>
  );
}
