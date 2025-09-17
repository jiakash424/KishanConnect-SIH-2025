export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <svg
        width="40"
        height="40"
        viewBox="0 0 200 200"
        className="h-8 w-8"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <path
            fill="#B56A2C"
            d="M100 0L117.3 12.7L140.5 12.7L150 32.7L167.3 42.7L167.3 67.3L184.5 77.3L175 97.3L184.5 117.3L167.3 127.3L167.3 152.7L150 162.7L140.5 182.7L117.3 182.7L100 200L82.7 182.7L59.5 182.7L50 162.7L32.7 152.7L32.7 127.3L15.5 117.3L25 97.3L15.5 77.3L32.7 67.3L32.7 42.7L50 32.7L59.5 12.7L82.7 12.7L100 0Z"
          />
          <path
            fill="#2E593F"
            d="M100 0L82.7 12.7L59.5 12.7L50 32.7L32.7 42.7L32.7 67.3L15.5 77.3L25 97.3L15.5 117.3L32.7 127.3L32.7 152.7L50 162.7L59.5 182.7L82.7 182.7L100 200L117.3 182.7L140.5 182.7L150 162.7L167.3 152.7L167.3 127.3L184.5 117.3L175 97.3L184.5 77.3L32.7 67.3L32.7 42.7L50 32.7L59.5 12.7L82.7 12.7L100 0Z"
            transform="rotate(30 100 100)"
          />
          <circle cx="100" cy="100" r="70" fill="white" />
          <g transform="translate(5, 5) scale(0.9)">
            <path
              d="M85,135 C100,130 110,120 115,110 L118,105 L120,100 L115,95 C110,85 100,75 85,70"
              stroke="#B56A2C"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M125,75 C120,85 115,95 110,105 L108,110 L105,115 C100,125 90,135 75,140"
              stroke="#2E593F"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M120,95 L125,92 L130,95 L125,98 Z M130,85 L135,82 L140,85 L135,88 Z M140,75 L145,72 L150,75 L145,78 Z"
              fill="#2E593F"
            />

            <path
              d="M 60,140 C 70,135, 80,135, 90,140"
              stroke="#B56A2C"
              strokeWidth="5"
              fill="none"
            />

            <g transform="translate(60, 100) scale(0.4)">
              <rect x="20" y="30" width="60" height="30" fill="#2E593F" />
              <rect x="30" y="10" width="40" height="20" fill="#2E593F" />
              <circle cx="20" cy="65" r="15" fill="#B56A2C" stroke="white" strokeWidth="2" />
              <circle cx="80" cy="65" r="18" fill="#B56A2C" stroke="white" strokeWidth="2" />
            </g>

            <path
              d="M110,130 Q120,100 130,70 L135,55 L140,70 Q130,100 120,130"
              stroke="#2E593F"
              strokeWidth="3"
              fill="none"
            />
            <path d="M132,70 L135,50 L138,70 Z" fill="#B56A2C" />

            <path
              d="M125,80 Q135,60 145,40"
              stroke="#B56A2C"
              strokeWidth="5"
              fill="none"
            />
            <path
              d="M130,75 L125,70 L130,65 L135,70 Z"
              fill="#B56A2C"
              transform="rotate(20 130 75)"
            />
            <path
              d="M135,65 L130,60 L135,55 L140,60 Z"
              fill="#B56A2C"
              transform="rotate(20 135 65)"
            />
            <path
              d="M140,55 L135,50 L140,45 L145,50 Z"
              fill="#B56A2C"
              transform="rotate(20 140 55)"
            />
             <path d="M120,135 H 170" stroke="#00AEEF" strokeWidth="2" />
              <path d="M125,130 H 165" stroke="#00AEEF" strokeWidth="2" />
              <path d="M130,125 H 160" stroke="#00AEEF" strokeWidth="2" />
              <path d="M135,120 H 155" stroke="#00AEEF" strokeWidth="2" />
              <circle cx="120" cy="135" r="2" fill="#00AEEF" />
              <circle cx="170" cy="135" r="2" fill="#00AEEF" />
              <circle cx="125" cy="130" r="2" fill="#00AEEF" />
              <circle cx="165" cy="130" r="2" fill="#00AEEF" />
              <circle cx="130" cy="125" r="2" fill="#00AEEF" />
              <circle cx="160" cy="125" r="2" fill="#00AEEF" />
              <circle cx="135" cy="120" r="2" fill="#00AEEF" />
              <circle cx="155" cy="120" r="2" fill="#00AEEF" />
          </g>
        </g>
      </svg>
      <h1 className="text-xl font-bold text-foreground">KrishiConnect</h1>
    </div>
  );
}
