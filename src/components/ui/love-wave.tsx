const ORB_SHAPE_1 =
  "M100,37 C136,37 163,66 163,102 C163,137 134,163 98,163 C63,163 37,133 37,98 C37,62 66,37 100,37 Z";
const ORB_SHAPE_2 =
  "M106,40 C141,42 162,64 160,96 C158,132 136,162 102,160 C66,158 38,138 40,104 C42,68 73,38 106,40 Z";
const ORB_SHAPE_3 =
  "M94,40 C132,38 164,67 165,100 C167,138 142,163 106,164 C72,165 37,130 36,96 C34,59 61,41 94,40 Z";
const ORB_SHAPE_4 =
  "M98,35 C132,36 161,66 160,100 C159,133 135,160 100,161 C66,162 37,133 38,100 C39,65 61,34 98,35 Z";

const ORB_EASE = "0.45 0 0.55 1";

const ORB_MORPH_ANIMATION = {
  attributeName: "d",
  values: [ORB_SHAPE_1, ORB_SHAPE_2, ORB_SHAPE_3, ORB_SHAPE_4, ORB_SHAPE_1].join(
    ";",
  ),
  keyTimes: "0;0.25;0.5;0.75;1",
  keySplines: [ORB_EASE, ORB_EASE, ORB_EASE, ORB_EASE].join(";"),
  calcMode: "spline",
  dur: "5s",
  repeatCount: "indefinite",
} as const;

const ORB_EASE_HALF = [ORB_EASE, ORB_EASE].join(";");

interface LoveWaveProps {
  size?: number
}

export default function LoveWave({ size = 190 }: LoveWaveProps) {
  return (
    <div
      className="duora-love-wrap"
      style={{
        width: size,
        height: size,
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .duora-love-wrap {
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
            }

            .duora-love-glow {
              position: absolute;
              width: 120px;
              height: 120px;
              border-radius: 9999px;
              background:
                radial-gradient(
                  circle,
                  rgba(129, 140, 248, 0.22) 0%,
                  rgba(192, 132, 252, 0.16) 38%,
                  rgba(244, 114, 182, 0.09) 62%,
                  transparent 78%
                );
              filter: blur(26px);
              animation: duoraLoveGlow 7s ease-in-out infinite;
            }

            .duora-love-svg {
              position: relative;
              width: 175px;
              height: 175px;
              overflow: visible;
            }

            .duora-orb-layer {
              transform-box: view-box;
              transform-origin: 100px 100px;
            }

            .duora-orb-flow-a {
              animation: duoraOrbFlowA 5s ease-in-out infinite;
            }

            .duora-orb-flow-b {
              animation: duoraOrbFlowB 7s ease-in-out infinite;
              animation-delay: -11s;
            }

            .duora-orb-flow-c {
              animation: duoraOrbFlowC 5s ease-in-out infinite;
              animation-delay: -17s;
            }

            .duora-orb-ribbon-a {
              animation: duoraOrbRibbonA 6s ease-in-out infinite;
              animation-delay: -6s;
            }

            .duora-orb-ribbon-b {
              animation: duoraOrbRibbonB 8s ease-in-out infinite;
              animation-delay: -21s;
            }

            .duora-orb-core {
              animation: duoraOrbCore 3s ease-in-out infinite;
            }

            .duora-orb-caustic {
              animation: duoraOrbCaustic 1s ease-in-out infinite;
            }

            .duora-orb-spec-a {
              animation: duoraOrbSpecA 2s ease-in-out infinite;
            }

            .duora-orb-spec-b {
              animation: duoraOrbSpecB 3s ease-in-out infinite;
              animation-delay: -8s;
            }

            @keyframes duoraLoveGlow {
              0%,
              100% {
                transform: scale(0.86);
                opacity: 0.6;
              }

              50% {
                transform: scale(1.1);
                opacity: 1;
              }
            }

            @keyframes duoraOrbFlowA {
              0%,
              100% {
                transform: translate(0px, 0px) rotate(0deg) scale(1);
              }

              35% {
                transform: translate(6px, -5px) rotate(16deg) scale(1.07);
              }

              70% {
                transform: translate(-5px, 5px) rotate(-12deg) scale(0.95);
              }
            }

            @keyframes duoraOrbFlowB {
              0%,
              100% {
                transform: translate(0px, 0px) rotate(0deg) scale(1);
              }

              40% {
                transform: translate(-6px, 4px) rotate(-18deg) scale(1.05);
              }

              75% {
                transform: translate(5px, -4px) rotate(10deg) scale(0.96);
              }
            }

            @keyframes duoraOrbFlowC {
              0%,
              100% {
                transform: translate(0px, 0px) rotate(0deg) scale(1);
              }

              30% {
                transform: translate(5px, 6px) rotate(14deg) scale(1.05);
              }

              65% {
                transform: translate(-6px, -3px) rotate(-16deg) scale(1.08);
              }
            }

            @keyframes duoraOrbRibbonA {
              0%,
              100% {
                transform: translate(0px, 0px) rotate(0deg);
              }

              50% {
                transform: translate(3px, -4px) rotate(10deg);
              }

              80% {
                transform: translate(-2px, 2px) rotate(-6deg);
              }
            }

            @keyframes duoraOrbRibbonB {
              0%,
              100% {
                transform: translate(0px, 0px) rotate(0deg);
              }

              45% {
                transform: translate(-2px, 3px) rotate(-11deg);
              }

              78% {
                transform: translate(2px, -2px) rotate(7deg);
              }
            }

            @keyframes duoraOrbCore {
              0%,
              100% {
                transform: translate(0px, 0px) scale(1);
              }

              50% {
                transform: translate(3px, -2px) scale(1.04);
              }
            }

            @keyframes duoraOrbCaustic {
              0%,
              100% {
                transform: translate(0px, 0px) scale(1);
                opacity: 0.55;
              }

              50% {
                transform: translate(-7px, 5px) scale(1.15);
                opacity: 0.9;
              }
            }

            @keyframes duoraOrbSpecA {
              0%,
              100% {
                transform: rotate(0deg);
              }

              40% {
                transform: rotate(8deg);
              }

              75% {
                transform: rotate(-5deg);
              }
            }

            @keyframes duoraOrbSpecB {
              0%,
              100% {
                transform: rotate(0deg);
              }

              50% {
                transform: rotate(-10deg);
              }
            }

            @media (prefers-reduced-motion: reduce) {
              .duora-love-glow,
              .duora-orb-flow-a,
              .duora-orb-flow-b,
              .duora-orb-flow-c,
              .duora-orb-ribbon-a,
              .duora-orb-ribbon-b,
              .duora-orb-core,
              .duora-orb-caustic,
              .duora-orb-spec-a,
              .duora-orb-spec-b {
                animation: none !important;
              }
            }
          `,
        }}
      />

      <div
        className="duora-love-glow"
        style={{
          width: size * 0.63,
          height: size * 0.63,
          filter: `blur(${size * 0.137}px)`,
        }}
      />

      <svg
        className="duora-love-svg"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{
          width: size * 0.92,
          height: size * 0.92,
        }}
      >
        <defs>
          {/* ---------- Gradients ---------- */}

          {/* Atmospheric glow */}
          <radialGradient id="duoraOrbAtmosA" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#5a6bff" stopOpacity="0.5" />
            <stop offset="62%" stopColor="#6d5cff" stopOpacity="0.42" />
            <stop offset="74%" stopColor="#8a5cf6" stopOpacity="0.3" />
            <stop offset="88%" stopColor="#a96bff" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#a96bff" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="duoraOrbAtmosB" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff6ad5" stopOpacity="0.35" />
            <stop offset="62%" stopColor="#f472b6" stopOpacity="0.3" />
            <stop offset="74%" stopColor="#e879f9" stopOpacity="0.22" />
            <stop offset="88%" stopColor="#f0abfc" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#f0abfc" stopOpacity="0" />
          </radialGradient>

          {/* Dark translucent glass body */}
          <radialGradient
            id="duoraOrbBase"
            cx="100"
            cy="100"
            r="66"
            fx="95"
            fy="90"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#02030a" stopOpacity="1" />
            <stop offset="50%" stopColor="#050719" stopOpacity="0.98" />
            <stop offset="80%" stopColor="#0a1030" stopOpacity="0.94" />
            <stop offset="100%" stopColor="#141a4a" stopOpacity="0.9" />
          </radialGradient>

          {/* Internal light blobs */}
          <radialGradient id="duoraOrbBlue" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#5b8cff" stopOpacity="1" />
            <stop offset="45%" stopColor="#2f55ff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#1d2fd8" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="duoraOrbCyan" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7ff3ff" stopOpacity="1" />
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="duoraOrbViolet" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#b794ff" stopOpacity="1" />
            <stop offset="50%" stopColor="#7c4dff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#5b21b6" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="duoraOrbMagenta" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff7be5" stopOpacity="1" />
            <stop offset="50%" stopColor="#e040d0" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#a21caf" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="duoraOrbPink" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffb3d9" stopOpacity="1" />
            <stop offset="50%" stopColor="#ff6fb5" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
          </radialGradient>

          {/* Light ribbons */}
          <linearGradient
            id="duoraOrbRibbonBlue"
            x1="52"
            y1="112"
            x2="146"
            y2="132"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="25%" stopColor="#38bdf8" stopOpacity="1" />
            <stop offset="55%" stopColor="#5b7cff" stopOpacity="0.95" />
            <stop offset="85%" stopColor="#8b5cf6" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>

          <linearGradient
            id="duoraOrbRibbonPink"
            x1="118"
            y1="48"
            x2="150"
            y2="120"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0" />
            <stop offset="30%" stopColor="#d946ef" stopOpacity="0.95" />
            <stop offset="65%" stopColor="#f472b6" stopOpacity="1" />
            <stop offset="100%" stopColor="#fb7185" stopOpacity="0" />
          </linearGradient>

          <linearGradient
            id="duoraOrbRibbonViolet"
            x1="50"
            y1="92"
            x2="84"
            y2="46"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
            <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#67e8f9" stopOpacity="0" />
          </linearGradient>

          <linearGradient
            id="duoraOrbRibbonMix"
            x1="132"
            y1="118"
            x2="96"
            y2="146"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#f0abfc" stopOpacity="0" />
            <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>

          {/* Dark core + faint inner caustic */}
          <radialGradient
            id="duoraOrbCore"
            cx="100"
            cy="100"
            r="50"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#010208" stopOpacity="0.98" />
            <stop offset="55%" stopColor="#02030a" stopOpacity="0.92" />
            <stop offset="85%" stopColor="#05071a" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#05071a" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="duoraOrbCaustic" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6f86ff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#6f86ff" stopOpacity="0" />
          </radialGradient>

          {/* Iridescent rim — gradient itself slowly drifts around the edge */}
          <linearGradient
            id="duoraOrbRimGrad"
            x1="38"
            y1="38"
            x2="162"
            y2="162"
            gradientUnits="userSpaceOnUse"
          >
            <animateTransform
              attributeName="gradientTransform"
              type="rotate"
              from="0 100 100"
              to="360 100 100"
              dur="48s"
              repeatCount="indefinite"
            />
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
            <stop offset="25%" stopColor="#3b6cff" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.85" />
            <stop offset="72%" stopColor="#e040d0" stopOpacity="0.9" />
            <stop offset="88%" stopColor="#f472b6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.9" />
          </linearGradient>

          {/* Glass surface sheen */}
          <linearGradient
            id="duoraOrbGloss"
            x1="60"
            y1="36"
            x2="140"
            y2="164"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
            <stop offset="30%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="60%" stopColor="#bcd0ff" stopOpacity="0" />
            <stop offset="100%" stopColor="#9bb7ff" stopOpacity="0.14" />
          </linearGradient>

          {/* Specular crescents */}
          <linearGradient
            id="duoraOrbSpec"
            x1="47.8"
            y1="86"
            x2="104.7"
            y2="46.2"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#bfe9ff" stopOpacity="0" />
            <stop offset="35%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#f5e6ff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          <linearGradient
            id="duoraOrbSpecB"
            x1="47.8"
            y1="86"
            x2="104.7"
            y2="46.2"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#a5f3fc" stopOpacity="0" />
            <stop offset="40%" stopColor="#c7e6ff" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#e9d5ff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* ---------- Organic silhouette clip (morphing) ---------- */}
          <clipPath id="duoraOrbClip" clipPathUnits="userSpaceOnUse">
            <path d={ORB_SHAPE_1}>
              <animate {...ORB_MORPH_ANIMATION} />
            </path>
          </clipPath>

          {/* ---------- Filters ---------- */}
          <filter
            id="duoraOrbBlurGlow"
            filterUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="200"
            height="200"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation="9" />
          </filter>

          <filter
            id="duoraOrbBlurHalo"
            filterUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="200"
            height="200"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation="7" />
          </filter>

          <filter
            id="duoraOrbBlurLg"
            filterUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="200"
            height="200"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation="6" />
          </filter>

          <filter
            id="duoraOrbBlurSm"
            filterUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="200"
            height="200"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation="1.8" />
          </filter>

          <filter
            id="duoraOrbBlurRim"
            filterUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="200"
            height="200"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation="3.4" />
          </filter>

          <filter
            id="duoraOrbBlurEdge"
            filterUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="200"
            height="200"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation="0.9" />
          </filter>

          <filter
            id="duoraOrbBlurSheen"
            filterUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="200"
            height="200"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation="1.3" />
          </filter>

          <filter
            id="duoraOrbBlurHi"
            filterUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="200"
            height="200"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation="0.7" />
          </filter>

          {/* Glass refraction: animated turbulence drives a displacement map,
              with slightly different strength per colour channel (dispersion) */}
          <filter
            id="duoraOrbRefract"
            filterUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="200"
            height="200"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.011 0.015"
              numOctaves="2"
              seed="11"
              result="duoraNoise"
            >
              <animate
                attributeName="baseFrequency"
                values="0.011 0.015;0.017 0.010;0.012 0.018;0.011 0.015"
                keyTimes="0;0.33;0.66;1"
                keySplines={[ORB_EASE, ORB_EASE, ORB_EASE].join(";")}
                calcMode="spline"
                dur="34s"
                repeatCount="indefinite"
              />
            </feTurbulence>

            <feDisplacementMap
              in="SourceGraphic"
              in2="duoraNoise"
              scale="12"
              xChannelSelector="R"
              yChannelSelector="G"
              result="duoraDispR"
            />
            <feColorMatrix
              in="duoraDispR"
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="duoraChanR"
            />

            <feDisplacementMap
              in="SourceGraphic"
              in2="duoraNoise"
              scale="15"
              xChannelSelector="R"
              yChannelSelector="G"
              result="duoraDispG"
            />
            <feColorMatrix
              in="duoraDispG"
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="duoraChanG"
            />

            <feDisplacementMap
              in="SourceGraphic"
              in2="duoraNoise"
              scale="18"
              xChannelSelector="R"
              yChannelSelector="G"
              result="duoraDispB"
            />
            <feColorMatrix
              in="duoraDispB"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
              result="duoraChanB"
            />

            <feBlend
              in="duoraChanR"
              in2="duoraChanG"
              mode="screen"
              result="duoraChanRG"
            />
            <feBlend
              in="duoraChanRG"
              in2="duoraChanB"
              mode="screen"
              result="duoraChanRGB"
            />
            <feColorMatrix
              in="duoraChanRGB"
              type="saturate"
              values="1.25"
            />
          </filter>
        </defs>

        {/* 1. Atmospheric glow (breathing) */}
        <g filter="url(#duoraOrbBlurGlow)">
          <circle cx="96" cy="106" r="80" fill="url(#duoraOrbAtmosA)">
            <animate
              attributeName="r"
              values="78;88;78"
              keyTimes="0;0.5;1"
              keySplines={ORB_EASE_HALF}
              calcMode="spline"
              dur="9s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.55;0.95;0.55"
              keyTimes="0;0.5;1"
              keySplines={ORB_EASE_HALF}
              calcMode="spline"
              dur="9s"
              repeatCount="indefinite"
            />
          </circle>

          <circle cx="106" cy="92" r="76" fill="url(#duoraOrbAtmosB)">
            <animate
              attributeName="r"
              values="74;84;74"
              keyTimes="0;0.5;1"
              keySplines={ORB_EASE_HALF}
              calcMode="spline"
              dur="11s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.8;0.4;0.8"
              keyTimes="0;0.5;1"
              keySplines={ORB_EASE_HALF}
              calcMode="spline"
              dur="11s"
              repeatCount="indefinite"
            />
          </circle>
        </g>

        {/* 2. Soft edge halo following the morphing silhouette */}
        <path
          d={ORB_SHAPE_1}
          fill="none"
          stroke="url(#duoraOrbRimGrad)"
          strokeWidth="10"
          opacity="0.38"
          filter="url(#duoraOrbBlurHalo)"
        >
          <animate {...ORB_MORPH_ANIMATION} />
          <animate
            attributeName="opacity"
            values="0.28;0.5;0.28"
            keyTimes="0;0.5;1"
            keySplines={ORB_EASE_HALF}
            calcMode="spline"
            dur="8s"
            repeatCount="indefinite"
          />
        </path>

        {/* 3. The orb itself — everything inside is clipped to the morphing blob */}
        <g clipPath="url(#duoraOrbClip)">
          {/* Dark translucent glass body */}
          <rect
            x="20"
            y="20"
            width="160"
            height="160"
            fill="url(#duoraOrbBase)"
          />

          {/* Internal flowing light, warped by the refraction filter */}
          <g filter="url(#duoraOrbRefract)">
            {/* Soft colour masses */}
            <g filter="url(#duoraOrbBlurLg)">
              <g className="duora-orb-layer duora-orb-flow-a">
                <ellipse
                  cx="66"
                  cy="126"
                  rx="40"
                  ry="24"
                  transform="rotate(-32 66 126)"
                  fill="url(#duoraOrbBlue)"
                />
                <ellipse
                  cx="112"
                  cy="150"
                  rx="34"
                  ry="15"
                  transform="rotate(-8 112 150)"
                  fill="url(#duoraOrbCyan)"
                />
              </g>

              <g className="duora-orb-layer duora-orb-flow-b">
                <ellipse
                  cx="54"
                  cy="82"
                  rx="30"
                  ry="20"
                  transform="rotate(-50 54 82)"
                  fill="url(#duoraOrbViolet)"
                />
                <ellipse
                  cx="88"
                  cy="44"
                  rx="26"
                  ry="12"
                  transform="rotate(-12 88 44)"
                  fill="url(#duoraOrbBlue)"
                />
              </g>

              <g className="duora-orb-layer duora-orb-flow-c">
                <ellipse
                  cx="148"
                  cy="76"
                  rx="32"
                  ry="22"
                  transform="rotate(35 148 76)"
                  fill="url(#duoraOrbMagenta)"
                />
                <ellipse
                  cx="150"
                  cy="122"
                  rx="22"
                  ry="30"
                  transform="rotate(-15 150 122)"
                  fill="url(#duoraOrbPink)"
                />
              </g>
            </g>

            {/* Thin flowing light ribbons */}
            <g filter="url(#duoraOrbBlurSm)">
              <g className="duora-orb-layer duora-orb-ribbon-a">
                <path
                  d="M52,112 C54,134 74,152 100,154 C120,155 136,146 146,132"
                  fill="none"
                  stroke="url(#duoraOrbRibbonBlue)"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                <path
                  d="M132,118 C128,136 112,146 96,146"
                  fill="none"
                  stroke="url(#duoraOrbRibbonMix)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </g>

              <g className="duora-orb-layer duora-orb-ribbon-b">
                <path
                  d="M118,48 C140,52 154,68 156,90 C157,102 154,112 150,120"
                  fill="none"
                  stroke="url(#duoraOrbRibbonPink)"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <path
                  d="M50,92 C48,70 62,52 84,46"
                  fill="none"
                  stroke="url(#duoraOrbRibbonViolet)"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </g>
            </g>
          </g>

          {/* Dark inner core keeps the centre deep and glassy */}
          <g className="duora-orb-layer duora-orb-core">
            <circle cx="100" cy="100" r="50" fill="url(#duoraOrbCore)" />
          </g>

          {/* Faint inner caustic for depth */}
          <g className="duora-orb-layer duora-orb-caustic">
            <ellipse
              cx="108"
              cy="106"
              rx="24"
              ry="14"
              transform="rotate(-25 108 106)"
              fill="url(#duoraOrbCaustic)"
            />
          </g>

          {/* Iridescent inner rim glow */}
          <path
            d={ORB_SHAPE_1}
            fill="none"
            stroke="url(#duoraOrbRimGrad)"
            strokeWidth="9"
            opacity="0.8"
            filter="url(#duoraOrbBlurRim)"
          >
            <animate {...ORB_MORPH_ANIMATION} />
          </path>

          {/* Very subtle edge definition (no hard border) */}
          <path
            d={ORB_SHAPE_1}
            fill="none"
            stroke="url(#duoraOrbRimGrad)"
            strokeWidth="2"
            opacity="0.32"
            filter="url(#duoraOrbBlurEdge)"
          >
            <animate {...ORB_MORPH_ANIMATION} />
          </path>

          {/* Glass surface sheen */}
          <rect
            x="20"
            y="20"
            width="160"
            height="160"
            fill="url(#duoraOrbGloss)"
          />

          {/* Edge sheens that drift slowly along the glass */}
          <g filter="url(#duoraOrbBlurSheen)">
            <path
              d={ORB_SHAPE_1}
              fill="none"
              stroke="#ffffff"
              strokeWidth="7"
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray="10 90"
              opacity="0.75"
            >
              <animate {...ORB_MORPH_ANIMATION} />
              <animate
                attributeName="stroke-dashoffset"
                values="12;22;12"
                keyTimes="0;0.5;1"
                keySplines={ORB_EASE_HALF}
                calcMode="spline"
                dur="21s"
                repeatCount="indefinite"
              />
            </path>

            <path
              d={ORB_SHAPE_1}
              fill="none"
              stroke="#c7d2fe"
              strokeWidth="6"
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray="14 86"
              opacity="0.45"
            >
              <animate {...ORB_MORPH_ANIMATION} />
              <animate
                attributeName="stroke-dashoffset"
                values="-30;-42;-30"
                keyTimes="0;0.5;1"
                keySplines={ORB_EASE_HALF}
                calcMode="spline"
                dur="27s"
                repeatCount="indefinite"
              />
            </path>
          </g>

          {/* White specular highlights */}
          <g filter="url(#duoraOrbBlurHi)">
            <g className="duora-orb-layer duora-orb-spec-a">
              <path
                d="M47.8,86 C54.6,60.7 78.6,43.9 104.7,46.2 C86,51 60,66 47.8,86 Z"
                fill="url(#duoraOrbSpec)"
              />
              <ellipse
                cx="71"
                cy="58"
                rx="7"
                ry="2.2"
                transform="rotate(-35 71 58)"
                fill="#ffffff"
                opacity="0.95"
              />
            </g>

            <g
              className="duora-orb-layer duora-orb-spec-b"
              opacity="0.5"
            >
              <path
                d="M47.8,86 C54.6,60.7 78.6,43.9 104.7,46.2 C86,51 60,66 47.8,86 Z"
                transform="rotate(180 100 100)"
                fill="url(#duoraOrbSpecB)"
              />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}