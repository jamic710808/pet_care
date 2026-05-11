"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Bath,
  CalendarCheck,
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Droplets,
  HeartHandshake,
  ListChecks,
  MapPin,
  MessageCircle,
  PawPrint,
  Phone,
  PhoneCall,
  Scissors,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";

type PriceCategory = "small" | "medium" | "cat";

type PriceItem = {
  name: string;
  description: string;
  amount: string;
};

type ServiceItem = {
  title: string;
  description: string;
  price: string;
  Icon: typeof Bath;
  iconClassName: string;
};

type ProcessItem = {
  step: string;
  title: string;
  description: string;
};

type CarouselSlide = {
  image: string;
  alt: string;
  title: string;
  description: string;
  ariaLabel: string;
};

type ReviewItem = {
  quote: string;
  name: string;
  pet: string;
};

type BookingSubmitState = "idle" | "submitting" | "success" | "error";

const prices: Record<PriceCategory, PriceItem[]> = {
  small: [
    {
      name: "基礎洗護",
      description: "適合 8kg 內小型犬，含耳道、指甲、腳底毛護理",
      amount: "NT$ 400",
    },
    {
      name: "洗護加精修",
      description: "含全身造型、面部修剪和尾部細節處理",
      amount: "NT$ 770",
    },
    {
      name: "深層護毛",
      description: "適合掉毛期、毛躁、静電明顯的寵物",
      amount: "NT$ 590",
    },
  ],
  medium: [
    {
      name: "基礎洗護",
      description: "適合 8-22kg 中型犬，按毛量調整時長",
      amount: "NT$ 630",
    },
    {
      name: "輪廓修剪",
      description: "腹底、臀部、腳邊 and 胸線整理",
      amount: "NT$ 1000",
    },
    {
      name: "去浮毛護理",
      description: "洗前梳理、浴後分層吹乾和護毛護理",
      amount: "NT$ 860",
    },
  ],
  cat: [
    {
      name: "短毛貓洗護",
      description: "獨立貓咪時段，含指甲和耳部基礎清潔",
      amount: "NT$ 770",
    },
    {
      name: "長毛貓洗護",
      description: "重點梳開胸腹、腋下和尾部毛髮",
      amount: "NT$ 1050",
    },
    {
      name: "局部剃毛",
      description: "腳底、腹部或輕度打結區域處理",
      amount: "NT$ 310 起",
    },
  ],
};

const priceTabs: Array<{ label: string; value: PriceCategory }> = [
  { label: "小型寵物", value: "small" },
  { label: "中型寵物", value: "medium" },
  { label: "貓咪護理", value: "cat" },
];

const services: ServiceItem[] = [
  {
    title: "基礎洗護",
    description: "清潔耳道、修剪腳底毛、指甲護理、低敏洗浴和分區吹乾。",
    price: "NT$ 400 起",
    Icon: Bath,
    iconClassName: "bg-sun text-[#11251f]",
  },
  {
    title: "精緻造型",
    description: "按品種和生活習慣設計造型，適合貴賓、比熊、雪納瑞等犬種。",
    price: "NT$ 770 起",
    Icon: Scissors,
    iconClassName: "bg-coral text-white",
  },
  {
    title: "皮毛護理",
    description: "針對打結、掉毛、乾燥和敏感皮膚，搭配護毛素與保養梳理。",
    price: "NT$ 590 起",
    Icon: Droplets,
    iconClassName: "bg-blue text-white",
  },
  {
    title: "幼寵適應",
    description: "縮短流程、降低噪音、正向獎勵，幫助幼寵建立温和洗護體驗。",
    price: "NT$ 310 起",
    Icon: HeartHandshake,
    iconClassName: "bg-mint text-[#11251f]",
  },
];

const processItems: ProcessItem[] = [
  {
    step: "01",
    title: "到店評估",
    description: "記錄毛髮、皮膚、耳道和情緒狀態，確認是否需要暫停或調整流程。",
  },
  {
    step: "02",
    title: "分區清潔",
    description: "使用低敏清潔產品，面部、耳部、腳掌和身體分開處理。",
  },
  {
    step: "03",
    title: "低噪吹乾",
    description: "根據寵物接受度調節風量和溫度，長毛寵物分層梳開。",
  },
  {
    step: "04",
    title: "交付回饋",
    description: "提供護理建議和本次狀態記錄，方便下次回顧寵物變化。",
  },
];

const carouselSlides: CarouselSlide[] = [
  {
    image: "/assets/interior-reception.png",
    alt: "中國高端寵物洗護店的接待與等候區",
    title: "接待與等候區",
    description: "暖木、石材與零售陳列結合，主人可以清楚看到後方透明操作區。",
    ariaLabel: "查看接待與等候區",
  },
  {
    image: "/assets/interior-wash.png",
    alt: "中國高端寵物洗護店的可視化洗護操作區",
    title: "可視化洗護區",
    description: "玻璃隔斷，專業洗護台與分區收納，呈現乾淨可信賴的護理流程。",
    ariaLabel: "查看可視化洗護區",
  },
  {
    image: "/assets/interior-grooming.png",
    alt: "中國高端寵物洗護店的獨立吹乾與精修護理區",
    title: "獨立吹乾精修區",
    description: "低噪護理間、獨立工位和柔和照明，適合貓咪與敏感寵物放鬆洗護。",
    ariaLabel: "查看獨立吹乾精修區",
  },
];

const reviews: ReviewItem[] = [
  {
    quote: "我家狗很怕吹風，店員會分段休息，洗完也沒有以前那種焦慮狀態。",
    name: "林女士",
    pet: "柯基主人",
  },
  {
    quote: "貓咪洗護時段很安靜，能看到操作區，過程比想象中順利很多。",
    name: "周先生",
    pet: "布偶貓主人",
  },
  {
    quote: "造型不會剪得誇張，美容師會先問日常活動習慣，細節很專業。",
    name: "趙女士",
    pet: "比熊主人",
  },
  {
    quote: "皮膚敏感的地方會提前標記，洗護後還會提醒回家觀察，服務很細。",
    name: "陳先生",
    pet: "柴犬主人",
  },
  {
    quote: "第一次帶幼犬洗澡，本來很擔心，結果全程都很溫柔，還拍了狀態照片。",
    name: "吳女士",
    pet: "泰迪主人",
  },
  {
    quote: "長毛貓打結處理得很耐心，沒有為了省時間直接大面積剃掉。",
    name: "許女士",
    pet: "緬因貓主人",
  },
  {
    quote: "每次來都會對比上次毛髮和耳道情況，像做了一份小小的護理檔案。",
    name: "何先生",
    pet: "雪納瑞主人",
  },
  {
    quote: "店裡味道很乾淨，等待區能看到操作，不會有寵物被帶走後看不見的焦慮。",
    name: "唐女士",
    pet: "博美主人",
  },
  {
    quote: "洗完毛髮蓬鬆但不刺鼻，美容師也會講清楚哪些護理沒必要加錢做。",
    name: "馬先生",
    pet: "英短主人",
  },
];

function getTomorrowMorningArrivalTime() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(9, 30, 0, 0);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

const reviewGroups = Array.from({ length: Math.ceil(reviews.length / 3) }, (_, index) =>
  reviews.slice(index * 3, index * 3 + 3),
);

const iconStroke = 2.1;

function ButtonLink({
  href,
  children,
  variant = "primary",
  ariaLabel,
  title,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "icon";
  ariaLabel?: string;
  title?: string;
}) {
  const variants = {
    primary:
      "min-h-[42px] rounded-lg bg-teal px-[18px] font-bold text-white shadow-[0_10px_26px_rgba(15,123,117,0.22)]",
    secondary:
      "min-h-[42px] rounded-lg border border-line bg-white px-[18px] font-bold text-ink",
    icon: "h-[42px] w-[42px] rounded-lg border border-line bg-white text-ink",
  };

  return (
    <a
      href={href}
      aria-label={ariaLabel}
      title={title}
      className={`inline-flex items-center justify-center gap-2 transition hover:-translate-y-0.5 ${variants[variant]}`}
    >
      {children}
    </a>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-line/80 bg-paper/90 backdrop-blur-[18px]">
      <nav
        className="mx-auto flex min-h-[72px] w-[min(1160px,calc(100%_-_32px))] items-center justify-between gap-6 max-sm:w-[min(100%_-_24px,1160px)]"
        aria-label="主導航"
      >
        <a
          className="inline-flex items-center gap-2.5 text-xl font-extrabold"
          href="#top"
          aria-label="泡泡爪 Pet Spa 首页"
        >
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-teal text-white shadow-[0_8px_24px_rgba(15,123,117,0.22)]">
            <PawPrint strokeWidth={iconStroke} />
          </span>
          <span className="max-sm:hidden">泡泡爪 Pet Spa</span>
        </a>
        <div className="flex items-center gap-[22px] whitespace-nowrap text-sm text-muted max-[920px]:hidden">
          <a className="hover:text-teal" href="#services">
            洗護項目
          </a>
          <a className="hover:text-teal" href="#process">
            護理流程
          </a>
          <a className="hover:text-teal" href="#pricing">
            價目表
          </a>
          <a className="hover:text-teal" href="#reviews">
            客戶評價
          </a>
          <a className="hover:text-teal" href="#contact">
            門店位置
          </a>
        </div>
        <div className="flex items-center gap-2.5">
          <ButtonLink
            href="tel:0908102687"
            variant="icon"
            ariaLabel="撥打電話"
            title="撥打電話"
          >
            <Phone strokeWidth={iconStroke} />
          </ButtonLink>
          <ButtonLink href="#booking">
            <CalendarCheck strokeWidth={iconStroke} />
            預約
          </ButtonLink>
        </div>
      </nav>
    </header>
  );
}

function BookingForm({
  onSubmit,
  submitState,
}: {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  submitState: BookingSubmitState;
}) {
  const defaultArrivalTime = getTomorrowMorningArrivalTime();
  const isSubmitting = submitState === "submitting";

  return (
    <form
      className="rounded-lg bg-white/95 p-6 text-ink shadow-soft"
      id="booking"
      onSubmit={onSubmit}
    >
      <h2 className="mb-1 text-2xl font-bold">快速預約</h2>
      <p className="mb-[18px] text-sm text-muted">提交後門店會在 10 分鐘內確認檔期。</p>
      <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
        <FormField label="聯絡人" htmlFor="name">
          <input id="name" name="name" placeholder="你的稱呼" required />
        </FormField>
        <FormField label="手機號" htmlFor="phone">
          <input id="phone" name="phone" placeholder="138 0000 0000" required />
        </FormField>
        <FormField label="期望到店時間" htmlFor="arrivalTime" full>
          <input
            defaultValue={defaultArrivalTime}
            id="arrivalTime"
            name="arrivalTime"
            type="datetime-local"
            required
          />
        </FormField>
        <FormField label="寵物類型" htmlFor="pet">
          <select id="pet" name="pet">
            <option>小型犬</option>
            <option>中大型犬</option>
            <option>長毛貓</option>
            <option>短毛貓</option>
          </select>
        </FormField>
        <FormField label="服務項目" htmlFor="service">
          <select id="service" name="service">
            <option>基礎洗護</option>
            <option>精緻造型</option>
            <option>皮毛護理</option>
            <option>幼寵適應</option>
          </select>
        </FormField>
        <FormField label="備註" htmlFor="note" full>
          <textarea
            id="note"
            name="note"
            placeholder="例如：怕吹風、容易緊張、需要剪指甲"
          />
        </FormField>
        <div className="col-span-full">
          <button
            className="inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-lg bg-teal px-[18px] font-bold text-white shadow-[0_10px_26px_rgba(15,123,117,0.22)] transition hover:-translate-y-0.5"
            disabled={isSubmitting}
            type="submit"
          >
            <Send strokeWidth={iconStroke} />
            {isSubmitting ? "提交中..." : "發送預約"}
          </button>
        </div>
      </div>
    </form>
  );
}

function FormField({
  children,
  label,
  htmlFor,
  full = false,
}: {
  children: React.ReactNode;
  label: string;
  htmlFor: string;
  full?: boolean;
}) {
  return (
    <div
      className={`grid gap-1.5 [&_input]:min-h-11 [&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-line [&_input]:bg-white [&_input]:px-3 [&_input]:py-2.5 [&_input]:text-ink [&_input]:outline-none [&_input:focus]:border-teal [&_input:focus]:shadow-[0_0_0_3px_rgba(15,123,117,0.12)] [&_select]:min-h-11 [&_select]:w-full [&_select]:rounded-lg [&_select]:border [&_select]:border-line [&_select]:bg-white [&_select]:px-3 [&_select]:py-2.5 [&_select]:text-ink [&_select]:outline-none [&_select:focus]:border-teal [&_select:focus]:shadow-[0_0_0_3px_rgba(15,123,117,0.12)] [&_textarea]:min-h-[78px] [&_textarea]:w-full [&_textarea]:resize-y [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:border-line [&_textarea]:bg-white [&_textarea]:px-3 [&_textarea]:py-2.5 [&_textarea]:text-ink [&_textarea]:outline-none [&_textarea:focus]:border-teal [&_textarea:focus]:shadow-[0_0_0_3px_rgba(15,123,117,0.12)] ${
        full ? "col-span-full" : ""
      }`}
    >
      <label className="text-[13px] font-bold text-[#354052]" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Hero({
  onBookingSubmit,
  submitState,
}: {
  onBookingSubmit: (event: FormEvent<HTMLFormElement>) => void;
  submitState: BookingSubmitState;
}) {
  return (
    <section className="relative isolate grid min-h-[calc(100vh-72px)] items-center overflow-hidden bg-[linear-gradient(90deg,rgba(15,25,35,0.72),rgba(15,25,35,0.38)_48%,rgba(15,25,35,0.1)),url('https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1800&q=82')] bg-cover bg-center after:absolute after:inset-x-0 after:bottom-0 after:-z-10 after:h-24 after:bg-gradient-to-b after:from-transparent after:to-paper max-sm:min-h-0">
      <div className="mx-auto grid w-[min(1160px,calc(100%_-_32px))] grid-cols-[minmax(0,590px)_minmax(320px,420px)] items-end gap-[70px] py-[70px] pb-28 text-white max-[920px]:grid-cols-1 max-sm:w-[min(100%_-_24px,1160px)] max-sm:gap-6 max-sm:py-12 max-sm:pb-[72px]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-mint/90 px-3 py-2 text-sm font-extrabold text-[#16302c]">
            <Sparkles strokeWidth={iconStroke} />
            一寵一浴巾 · 可視化洗護
          </span>
          <h1 className="my-[22px] mb-[18px] max-w-[620px] text-[clamp(42px,7vw,82px)] font-extrabold leading-none tracking-normal">
            泡泡爪 Pet Spa
          </h1>
          <p className="mb-[30px] max-w-[540px] text-lg text-white/85 max-sm:text-base">
            為貓狗提供洗澡、精修、皮毛護理和幼寵適應服務。透明操作區、低噪吹乾間和獨立消毒工具，讓每次洗護都更安心。
          </p>
          <div className="mb-[34px] flex flex-wrap gap-3">
            <ButtonLink href="#booking">
              <CalendarPlus strokeWidth={iconStroke} />
              立即預約
            </ButtonLink>
            <a
              className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-lg border border-white/35 bg-white/10 px-[18px] font-bold text-white backdrop-blur-xl transition hover:-translate-y-0.5"
              href="#pricing"
            >
              <ListChecks strokeWidth={iconStroke} />
              查看價目
            </a>
          </div>
          <div
            className="grid max-w-[560px] grid-cols-3 gap-3 max-sm:grid-cols-1"
            aria-label="門市亮點"
          >
            {[
              ["4.9", "本地客戶評分"],
              ["45min", "小型犬基礎洗護"],
              ["09:30", "每日開始營業"],
            ].map(([value, label]) => (
              <div
                className="rounded-lg border border-white/25 bg-white/10 p-3.5 backdrop-blur-xl"
                key={label}
              >
                <strong className="block text-[22px] leading-tight">{value}</strong>
                <span className="text-[13px] text-white/80">{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="max-[920px]:max-w-[560px]">
          <BookingForm onSubmit={onBookingSubmit} submitState={submitState} />
        </div>
      </div>
    </section>
  );
}

function SectionHead({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-7 flex items-end justify-between gap-6 max-sm:grid max-sm:gap-2.5">
      <h2 className="m-0 text-[clamp(28px,4vw,44px)] font-extrabold leading-[1.15] tracking-normal">
        {title}
      </h2>
      {children ? <p className="m-0 max-w-[430px] text-muted">{children}</p> : null}
    </div>
  );
}

function Services() {
  return (
    <section className="mx-auto w-[min(1160px,calc(100%_-_32px))] py-[76px] max-sm:w-[min(100%_-_24px,1160px)] max-sm:py-[54px]" id="services">
      <SectionHead title="洗護項目">
        從日常清潔到造型護理，按寵物體型、毛量和情緒狀態安排獨立方案。
      </SectionHead>
      <div className="grid grid-cols-4 gap-4 max-[920px]:grid-cols-2 max-sm:grid-cols-1">
        {services.map(({ title, description, price, Icon, iconClassName }) => (
          <article
            className="flex min-h-[230px] flex-col justify-between rounded-lg border border-line bg-panel p-5 transition hover:-translate-y-1 hover:shadow-soft"
            key={title}
          >
            <div>
              <span
                className={`grid h-12 w-12 place-items-center rounded-lg ${iconClassName}`}
              >
                <Icon strokeWidth={iconStroke} />
              </span>
              <h3 className="mb-2 mt-[18px] text-xl font-bold">{title}</h3>
              <p className="m-0 text-sm text-muted">{description}</p>
            </div>
            <div className="mt-[18px] flex items-center justify-between gap-3 font-extrabold text-teal">
              <span>{price}</span>
              <ArrowRight strokeWidth={iconStroke} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="mx-auto grid w-[min(1160px,calc(100%_-_32px))] grid-cols-[0.9fr_1.1fr] items-stretch gap-[34px] py-[76px] max-[920px]:grid-cols-1 max-sm:w-[min(100%_-_24px,1160px)] max-sm:py-[54px]" id="process">
      <div className="relative min-h-[520px] overflow-hidden rounded-lg bg-[url('https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1000&q=82')] bg-cover bg-center max-sm:min-h-[330px]">
        <span className="absolute bottom-[18px] left-[18px] flex items-center gap-2.5 rounded-lg bg-ink/70 px-3.5 py-3 font-extrabold text-white backdrop-blur-xl">
          <ShieldCheck strokeWidth={iconStroke} />
          獨立消毒工具包
        </span>
      </div>
      <div>
        <SectionHead title="護理流程" />
        <div className="grid gap-3">
          {processItems.map((item) => (
            <div
              className="grid grid-cols-[52px_1fr] gap-3.5 rounded-lg border border-line bg-white p-[18px]"
              key={item.step}
            >
              <span className="grid h-[52px] w-[52px] place-items-center rounded-lg bg-[#edf8f5] text-lg font-black text-teal">
                {item.step}
              </span>
              <div>
                <h3 className="mb-1 text-lg font-bold">{item.title}</h3>
                <p className="m-0 text-muted">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const [activeCategory, setActiveCategory] = useState<PriceCategory>("small");

  return (
    <section className="border-y border-[#d9ebe7] bg-[#eef6f4]" id="pricing">
      <div className="mx-auto w-[min(1160px,calc(100%_-_32px))] py-[76px] max-sm:w-[min(100%_-_24px,1160px)] max-sm:py-[54px]">
        <SectionHead title="透明價目">
          價格按體型和毛量浮動，嚴重打結、攻擊性行為或特殊護理會提前溝通。
        </SectionHead>
        <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label="價目分類">
          {priceTabs.map((tab) => (
            <button
              className={`min-h-10 rounded-full border px-3.5 font-extrabold ${
                activeCategory === tab.value
                  ? "border-teal bg-teal text-white"
                  : "border-[#cfe4df] bg-white text-muted"
              }`}
              type="button"
              role="tab"
              aria-selected={activeCategory === tab.value}
              key={tab.value}
              onClick={() => setActiveCategory(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div
          className="overflow-hidden rounded-lg border border-[#cfe4df] bg-white"
          aria-live="polite"
        >
          {prices[activeCategory].map((item) => (
            <div
              className="grid min-h-[68px] grid-cols-[1.2fr_1fr_120px] items-center gap-4 border-b border-[#e3efec] px-[18px] py-4 last:border-b-0 max-sm:grid-cols-1"
              key={item.name}
            >
              <strong className="text-[17px]">{item.name}</strong>
              <span className="text-sm text-muted">{item.description}</span>
              <div className="text-right text-xl font-black text-teal max-sm:text-left">
                {item.amount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EnvironmentCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);

  const showSlide = (index: number) => {
    setActiveSlide((index + carouselSlides.length) % carouselSlides.length);
  };

  return (
    <section className="mx-auto w-[min(1160px,calc(100%_-_32px))] py-[76px] max-sm:w-[min(100%_-_24px,1160px)] max-sm:py-[54px]" id="environment">
      <SectionHead title="店內環境">
        明亮等待區、可視化操作台和獨立貓咪洗護時段，讓寵物與主人都更放鬆。
      </SectionHead>
      <div className="relative overflow-hidden rounded-lg bg-[#dfe7ed] shadow-soft" aria-label="店內環境輪播">
        <div
          className="flex transition-transform duration-500 ease-out will-change-transform"
          style={{ transform: `translateX(-${activeSlide * 100}%)` }}
        >
          {carouselSlides.map((slide) => (
            <figure
              className="relative m-0 h-[560px] flex-[0_0_100%] max-[920px]:h-[460px] max-sm:h-[360px]"
              key={slide.title}
            >
              <Image
                className="object-cover"
                src={slide.image}
                alt={slide.alt}
                fill
                sizes="(max-width: 920px) 100vw, 1160px"
              />
              <figcaption className="absolute bottom-[22px] left-[22px] max-w-[min(420px,calc(100%_-_44px))] rounded-lg bg-night/70 px-4 py-3.5 text-white backdrop-blur-xl max-sm:inset-x-3 max-sm:bottom-[54px] max-sm:max-w-none">
                <strong className="mb-1 block text-lg">{slide.title}</strong>
                <span className="block text-sm text-white/80">{slide.description}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <button
          className="absolute left-[18px] top-1/2 z-[2] grid h-11 w-11 -translate-y-1/2 place-items-center rounded-lg border border-white/50 bg-night/50 text-white backdrop-blur-xl hover:bg-night/70 max-sm:left-3 max-sm:h-[38px] max-sm:w-[38px]"
          type="button"
          aria-label="上一張店內環境"
          onClick={() => showSlide(activeSlide - 1)}
        >
          <ChevronLeft strokeWidth={iconStroke} />
        </button>
        <button
          className="absolute right-[18px] top-1/2 z-[2] grid h-11 w-11 -translate-y-1/2 place-items-center rounded-lg border border-white/50 bg-night/50 text-white backdrop-blur-xl hover:bg-night/70 max-sm:right-3 max-sm:h-[38px] max-sm:w-[38px]"
          type="button"
          aria-label="下一張店內環境"
          onClick={() => showSlide(activeSlide + 1)}
        >
          <ChevronRight strokeWidth={iconStroke} />
        </button>
        <div
          className="absolute bottom-6 right-[22px] z-[2] flex gap-2 max-sm:bottom-[18px] max-sm:right-3.5"
          aria-label="店內環境圖片選擇"
        >
          {carouselSlides.map((slide, index) => (
            <button
              className={`h-2.5 rounded-full p-0 transition-all ${
                activeSlide === index ? "w-7 bg-white" : "w-2.5 bg-white/60"
              }`}
              type="button"
              aria-label={slide.ariaLabel}
              key={slide.title}
              onClick={() => showSlide(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  const [activeReviewGroup, setActiveReviewGroup] = useState(0);

  const showReviewGroup = (index: number) => {
    setActiveReviewGroup((index + reviewGroups.length) % reviewGroups.length);
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveReviewGroup((current) => (current + 1) % reviewGroups.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="mx-auto w-[min(1160px,calc(100%_-_32px))] py-[76px] max-sm:w-[min(100%_-_24px,1160px)] max-sm:py-[54px]" id="reviews">
      <div className="mb-7 flex items-end justify-between gap-5 max-sm:block">
        <SectionHead title="客戶評價">
          每次服務結束都會記錄寵物狀態，長期客戶可以追蹤毛髮與皮膚變化。
        </SectionHead>
        <div className="flex shrink-0 items-center gap-2 max-sm:mt-4">
          <button
            className="grid h-10 w-10 place-items-center rounded-lg border border-line bg-white text-ink transition hover:-translate-y-0.5 hover:border-teal"
            type="button"
            aria-label="上一組客戶評價"
            onClick={() => showReviewGroup(activeReviewGroup - 1)}
          >
            <ChevronLeft strokeWidth={iconStroke} />
          </button>
          <button
            className="grid h-10 w-10 place-items-center rounded-lg border border-line bg-white text-ink transition hover:-translate-y-0.5 hover:border-teal"
            type="button"
            aria-label="下一組客戶評價"
            onClick={() => showReviewGroup(activeReviewGroup + 1)}
          >
            <ChevronRight strokeWidth={iconStroke} />
          </button>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border border-line bg-[#f8fbf8]" aria-live="polite">
        <div
          className="flex transition-transform duration-700 ease-out will-change-transform"
          style={{ transform: `translateX(-${activeReviewGroup * 100}%)` }}
        >
          {reviewGroups.map((group, groupIndex) => (
            <div
              className="grid flex-[0_0_100%] grid-cols-3 gap-4 p-4 max-[920px]:grid-cols-2 max-sm:grid-cols-1 max-sm:p-3"
              key={groupIndex}
            >
              {group.map((review) => (
                <article
                  className="flex min-h-[218px] flex-col rounded-lg border border-line bg-white p-5 shadow-[0_14px_34px_rgba(24,42,38,0.06)]"
                  key={review.name}
                >
                  <div className="mb-3 flex gap-[3px] text-[#e7aa10]" aria-label="五星評價">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} fill="currentColor" strokeWidth={iconStroke} />
                    ))}
                  </div>
                  <p className="mb-5 text-[#354052]">“{review.quote}”</p>
                  <div className="mt-auto border-t border-line pt-4">
                    <strong className="block">{review.name}</strong>
                    <span className="text-[13px] text-muted">{review.pet}</span>
                  </div>
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex justify-center gap-2" aria-label="客戶評價輪播選擇">
        {reviewGroups.map((_, index) => (
          <button
            className={`h-2.5 rounded-full p-0 transition-all ${
              activeReviewGroup === index ? "w-8 bg-teal" : "w-2.5 bg-[#bfd7d1]"
            }`}
            type="button"
            aria-label={`查看第 ${index + 1} 組客戶評價`}
            key={index}
            onClick={() => showReviewGroup(index)}
          />
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="mx-auto grid w-[min(1160px,calc(100%_-_32px))] gap-[18px] py-[76px] max-sm:w-[min(100%_-_24px,1160px)] max-sm:py-[54px]" id="contact">
      <div className="rounded-lg bg-night p-[26px] text-white">
        <h2 className="mb-5 text-[clamp(28px,4vw,44px)] font-extrabold leading-[1.15] text-white">
          門市資訊
        </h2>
        <ul className="m-0 grid list-none grid-cols-4 gap-4 p-0 max-[980px]:grid-cols-2 max-sm:grid-cols-1">
          {[
            {
              Icon: MapPin,
              title: "地址",
              text: "324 桃園市平鎮區金陵路四段九十巷十號",
            },
            { Icon: Clock3, title: "營業時間", text: "週一至週日 09:30 - 20:30" },
            { Icon: PhoneCall, title: "電話", text: "0908102687" },
            { Icon: MessageCircle, title: "LINE", text: "ken19820808" },
          ].map(({ Icon, title, text }) => (
            <li className="grid grid-cols-[34px_1fr] gap-3 text-white/80" key={title}>
              <Icon strokeWidth={iconStroke} />
              <div>
                <strong className="block text-white">{title}</strong>
                {text}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div
        className="relative min-h-[560px] overflow-hidden rounded-lg border border-line bg-[#eef6f2] shadow-map max-[920px]:min-h-[460px] max-sm:min-h-[330px]"
        aria-label="泡泡爪 Pet Spa 門市位置示意圖，地址為桃園市平鎮區金陵路四段九十巷十號"
      >
        <Image
          className="object-cover"
          src="/assets/store-map-new.png"
          alt="泡泡爪 Pet Spa 位於桃園市平鎮區金陵路四段九十巷十號的可愛寵物店風格地圖"
          fill
          sizes="(max-width: 1160px) 100vw, 1160px"
        />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line bg-white py-[26px] text-muted">
      <div className="mx-auto flex w-[min(1160px,calc(100%_-_32px))] items-center justify-between gap-4 text-sm max-sm:grid max-sm:w-[min(100%_-_24px,1160px)]">
        <span>© 2026 泡泡爪 Pet Spa</span>
        <span>一寵一檔 · 一用一消毒 · 預約優先</span>
      </div>
    </footer>
  );
}

export default function Home() {
  const [bookingSubmitState, setBookingSubmitState] =
    useState<BookingSubmitState>("idle");
  const [toastMessage, setToastMessage] = useState("");
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string, state: BookingSubmitState) => {
    setToastMessage(message);
    setBookingSubmitState(state);

    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    toastTimeoutRef.current = setTimeout(() => {
      setBookingSubmitState("idle");
    }, 2800);
  };

  const handleBookingSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    setBookingSubmitState("submitting");

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          phone: formData.get("phone"),
          arrivalTime: formData.get("arrivalTime"),
          pet: formData.get("pet"),
          service: formData.get("service"),
          note: formData.get("note"),
        }),
      });

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;

        throw new Error(result?.message ?? "預約提交失敗，請稍後再試。");
      }

      form.reset();
      showToast("預約資訊已收到，門市會儘快聯繫你確認時間。", "success");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "預約提交失敗，請稍後再試。",
        "error",
      );
    }
  };

  return (
    <>
      <Header />
      <main id="top">
        <Hero
          onBookingSubmit={handleBookingSubmit}
          submitState={bookingSubmitState}
        />
        <Services />
        <Process />
        <Pricing />
        <EnvironmentCarousel />
        <Reviews />
        <Contact />
      </main>
      <Footer />
      <div
        className={`pointer-events-none fixed bottom-[18px] right-[18px] z-20 max-w-[340px] rounded-lg bg-night px-4 py-3.5 text-white shadow-soft transition ${
          bookingSubmitState === "success" || bookingSubmitState === "error"
            ? "translate-y-0 opacity-100"
            : "translate-y-6 opacity-0"
        }`}
        role="status"
        aria-live="polite"
      >
        {toastMessage}
      </div>
    </>
  );
}
