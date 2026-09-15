
import { Instagram, Linkedin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const WhatsappIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.487 5.235 3.487 8.413C24 18.662 18.668 24 .057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.371-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.296-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.289.173-1.413z" />
    </svg>
);
  
  const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10C2.5 6 4.5 4 7 4h10c2.5 0 4.5 2 4.5 3.5v0a24.12 24.12 0 0 1 0 10c0 1.5-2 3.5-4.5 3.5H7c-2.5 0-4.5-2-4.5-3.5v0Z" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );

export default function Footer() {
  return (
    <footer className="bg-secondary">
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <Image src="/img/logofavicon.ico" alt="The RoboBox Favicon" width={32} height={32} />
            <p className="text-sm font-semibold">
              The RoboBox
            </p>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} The RoboBox Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="https://www.instagram.com/therobobox/" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <Instagram className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
            </Link>
            <Link href="https://api.whatsapp.com/send?phone=918591374712" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
              <WhatsappIcon className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
            </Link>
            <Link href="https://youtube.com/@therobobox8777" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
              <YoutubeIcon className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
