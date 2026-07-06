import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";

interface EventCardProps {
  eventId: string;
  image: string;
  title: string;
  location: string;
  price: string;
}

export function EventCard({ eventId, image, title, location, price }: EventCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#e0e0e0] bg-[#ffffff] shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-44 w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="mb-1 text-sm font-bold text-[#1a1a1a] line-clamp-1">{title}</h3>
        <div className="mb-3 flex items-center gap-1 text-xs text-[#666666]">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          <span className="line-clamp-1">{location}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-[#2d5f5d]">{price}</span>
          <Link
            href={`/chi-tiet-su-kien/${eventId}`}
            className="rounded-full bg-[#2d5f5d] px-4 py-1.5 text-xs font-medium text-[#ffffff] transition-colors hover:bg-[#245250]"
          >
            Mua ve
          </Link>
        </div>
      </div>
    </div>
  );
}
