export interface Event {
  id: string;
  name: string;
  category: "music" | "festival" | "exhibition" | "sports";
  categoryVN: string;
  image: string;
  date: string;
  location: string;
  price: number;
  description: string;
  ticketTypes: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  details: {
    artists: string[];
    venue: string;
    address: string;
    startTime: string;
    endTime: string;
  };
  buyerInfo?: {
    fullName: string;
    email: string;
    phone: string;
  };
}

export const events: Event[] = [
  {
    id: "event-1",
    name: "Taylor Swift Show",
    category: "music",
    categoryVN: "Nhạc sống",
    image: "/images/event-anhtrai.jpg",
    date: "26/04/2026",
    location: "Việt Nam",
    price: 500000,
    description: "Buổi hòa nhạc đặc biệt của Taylor Swift tại Việt Nam",
    ticketTypes: [
      { name: "VIP", quantity: 100, price: 500000 },
      { name: "Standard", quantity: 200, price: 300000 },
      { name: "Economy", quantity: 300, price: 150000 },
    ],
    details: {
      artists: ["Taylor Swift"],
      venue: "Nhà thi đấu Quốc gia",
      address: "Tây Hồ, Hà Nội",
      startTime: "19:00",
      endTime: "22:00",
    },
  },
  {
    id: "event-2",
    name: "Anh trai Say Hi",
    category: "music",
    categoryVN: "Nhạc sống",
    image: "/images/event-liverpool.jpg",
    date: "30/05/2026",
    location: "Việt Nam",
    price: 600000,
    description: "Ch\u01B0\u01A1ng tr\u00ECnh \u00E2m nh\u1EA1c Say Hi \u0111\u1EB7c bi\u1EC7t",
    ticketTypes: [
      { name: "VIP", quantity: 80, price: 600000 },
      { name: "Standard", quantity: 150, price: 350000 },
      { name: "Economy", quantity: 250, price: 180000 },
    ],
    details: {
      artists: ["Anh trái"],
      venue: "Sân vận động Mỹ Đình",
      address: "Nam Từ Liêm, Hà Nội",
      startTime: "18:00",
      endTime: "21:00",
    },
  },
  {
    id: "event-3",
    name: "All-Rounder Soobin",
    category: "music",
    categoryVN: "Nhạc sống",
    image: "/images/event-keinouui.jpg",
    date: "29/11/2026",
    location: "Việt Nam",
    price: 800000,
    description: "Liveshow All-Rounder c\u1EE7a Soobin Ho\u00E0ng S\u01A1n",
    ticketTypes: [
      { name: "VIP", quantity: 120, price: 800000 },
      { name: "Standard", quantity: 200, price: 450000 },
      { name: "Economy", quantity: 350, price: 220000 },
    ],
    details: {
      artists: ["Soobin Hoàng Sơn"],
      venue: "Nhà thi đấu Phú Thọ",
      address: "Quận 11, TP.HCM",
      startTime: "19:30",
      endTime: "22:30",
    },
  },
  {
    id: "event-4",
    name: "Avenged Sevenfold Live",
    category: "music",
    categoryVN: "Nhạc sống",
    image: "/images/event-avenged.jpg",
    date: "15/06/2026",
    location: "Việt Nam",
    price: 450000,
    description: "\u0110\u00EAm nh\u1EA1c rock Avenged Sevenfold t\u1EA1i Vi\u1EC7t Nam",
    ticketTypes: [
      { name: "VIP", quantity: 90, price: 450000 },
      { name: "Standard", quantity: 180, price: 280000 },
      { name: "Economy", quantity: 280, price: 140000 },
    ],
    details: {
      artists: ["Avenged Sevenfold"],
      venue: "Sân vận động Thống Nhất",
      address: "Quận 10, TP.HCM",
      startTime: "20:00",
      endTime: "23:00",
    },
  },
  {
    id: "event-5",
    name: "Lễ hội âm nhạc Việt 2026",
    category: "festival",
    categoryVN: "Lễ hội",
    image: "/images/event-trienlam.jpg",
    date: "10/07/2026",
    location: "Việt Nam",
    price: 250000,
    description: "Lễ hội âm nhạc lớn nhất năm 2026",
    ticketTypes: [
      { name: "VIP", quantity: 200, price: 250000 },
      { name: "Standard", quantity: 400, price: 150000 },
      { name: "Economy", quantity: 600, price: 80000 },
    ],
    details: {
      artists: ["Nhiều nghệ sĩ"],
      venue: "Công viên Tào Đàn",
      address: "Hoàn Kiếm, Hà Nội",
      startTime: "10:00",
      endTime: "23:00",
    },
  },
  {
    id: "event-6",
    name: "Triển lãm Nghệ thuật Đương đại",
    category: "exhibition",
    categoryVN: "Triển lãm",
    image: "/images/event-museum.jpg",
    date: "01/03/2026",
    location: "Việt Nam",
    price: 80000,
    description: "Triển lãm Nghệ thuật Đương đại toàn châu Á",
    ticketTypes: [
      { name: "VIP", quantity: 150, price: 80000 },
      { name: "Standard", quantity: 300, price: 50000 },
      { name: "Student", quantity: 500, price: 30000 },
    ],
    details: {
      artists: ["Nhiều nghệ sĩ"],
      venue: "Bảo tàng Mỹ thuật Việt Nam",
      address: "Hoàn Kiếm, Hà Nội",
      startTime: "08:00",
      endTime: "18:00",
    },
  },
  {
    id: "event-7",
    name: "Liverpool vs Chelsea",
    category: "sports",
    categoryVN: "Thể thao",
    image: "/images/event-liverpool.jpg",
    date: "14/03/2026",
    location: "Anh",
    price: 1200000,
    description: "Trận đấu Premier League: Liverpool vs Chelsea",
    ticketTypes: [
      { name: "VIP", quantity: 100, price: 1200000 },
      { name: "Standard", quantity: 300, price: 800000 },
      { name: "Economy", quantity: 500, price: 400000 },
    ],
    details: {
      artists: ["Liverpool FC vs Chelsea FC"],
      venue: "Anfield",
      address: "Liverpool, England",
      startTime: "15:00",
      endTime: "17:00",
    },
  },
];

export function getEventsByCategory(category: string): Event[] {
  if (category === "all") return events;
  return events.filter((e) => e.category === category);
}

export function searchEvents(query: string): Event[] {
  const q = query.toLowerCase();
  return events.filter(
    (e) =>
      e.name.toLowerCase().includes(q) ||
      e.categoryVN.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q)
  );
}

export function getEventById(id: string): Event | undefined {
  return events.find((e) => e.id === id);
}
