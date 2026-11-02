import Image from "next/image";

interface ClientLogo {
  id: number;
  name: string;
  company_url?: string | null;
  logo: string | null;
}

interface Props {
  items: ClientLogo[];
}

// Infinite logo marquee. The list is rendered twice and `animate-marquee`
// shifts the track by half its width every 30s at constant speed, so the
// second copy lands exactly where the first started. This runs on the
// compositor in CSS; it used to be a GSAP tween that updated the transform
// from JavaScript on every frame.
export default function TrustedBySlider({ items }: Props) {
  return (
    <div className="overflow-hidden py-4">
      <h3 className="text-start text-3xl font-bold mb-4">
        Trusted by Leading Brands
      </h3>

      <div className="relative w-full overflow-hidden">
        {/* w-max: the track must be as wide as its content for the -50% shift */}
        <div className="flex w-max items-center gap-16 whitespace-nowrap will-change-transform animate-marquee">
          {[...items, ...items].map((client, index) => (
            <a
              key={`${client.id}-${index}`}
              href={client.company_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 opacity-80 hover:opacity-100 transition"
            >
              <div className="w-40 h-20 flex items-center justify-center">
                {client.logo ? (
                  <Image
                    src={client.logo}
                    alt={client.name}
                    width={160}
                    height={80}
                    className="object-contain"
                    sizes="160px"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-sm font-medium">
                    {client.name}
                  </span>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
