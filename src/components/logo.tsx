
export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <svg
        width="32"
        height="32"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
      >
        <rect width="40" height="40" rx="8" fill="#4CAF50"/>
        <path d="M13 29V20.5C13 18.29 14.79 16.5 17 16.5H23C25.21 16.5 27 18.29 27 20.5V29" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20 23C21.6569 23 23 21.6569 23 20C23 18.3431 21.6569 17 20 17C18.3431 17 17 18.3431 17 20C17 21.6569 18.3431 23 20 23Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 13L20 11L24 13" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <h1 className="text-xl font-bold text-foreground">KrishiConnect</h1>
    </div>
  );
}
