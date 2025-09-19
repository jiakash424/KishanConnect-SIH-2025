import Image from 'next/image';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Image
        src="/logo.jpg"
        alt="KrishiConnect Logo"
        width={32}
        height={32}
        className="h-8 w-8 rounded-md"
      />
      <h1 className="text-xl font-bold text-foreground">KrishiConnect</h1>
    </div>
  );
}
