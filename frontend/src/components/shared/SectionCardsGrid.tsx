

// type Props = {
//   children: React.ReactNode;
//   mode?: "grid" | "scroll";
//   visibleCount?: number;
//   gap?: number;
//   cardWidth?: number; // ✅ عرض ثابت للكرت
// };

// export default function SectionCardsGrid({
//   children,
//   mode = "grid",
//   visibleCount = 3,
//   gap = 16,
//   cardWidth = 383, // ✅ نفس الكرت
// }: Props) {
//   const items = Array.isArray(children) ? children : [children];

//   if (mode === "grid") {
//     return (
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: `repeat(${Math.min(visibleCount, items.length)}, ${cardWidth}px)`,
//           gap,
//         }}
//       >
//         {items}
//       </div>
//     );
//   }

//   // ✅ scroll: عرض ثابت للكروت، والكونتينر هو اللي يقرر كم كرت يبان
//   return (
//     <div
//       style={{
//         display: "flex",
//         gap,
//         overflowX: "auto",
//         overflowY: "visible",
//         paddingBottom: 8,
//         paddingRight: gap,
//         scrollSnapType: "x mandatory",
//         WebkitOverflowScrolling: "touch",
//       }}
//     >
//       {items.map((child, i) => (
//         <div
//           key={i}
//           style={{
//             flex: `0 0 ${cardWidth}px`, // ✅ ثبات حقيقي
//             scrollSnapAlign: "start",
//           }}
//         >
//           {child}
//         </div>
//       ))}
//     </div>
//   );
// }


type Props = {
    children: React.ReactNode;
    mode?: "grid" | "scroll";
    visibleCount?: number;
    gap?: number;
    cardWidth?: number; // ✅ عرض ثابت للكرت
  };
  
  export default function SectionCardsGrid({
    children,
    mode = "grid",
    visibleCount = 3,
    gap = 16,
    cardWidth = 383, // ✅ نفس الكرت
  }: Props) {
    const items = Array.isArray(children) ? children : [children];
  
    if (mode === "grid") {
      return (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(
              visibleCount,
              items.length
            )}, ${cardWidth}px)`,
            gap,
            alignItems: "stretch", // ✅
          }}
        >
          {items}
        </div>
      );
    }
  
    // ✅ scroll: عرض ثابت للكروت + نفس الارتفاع
    return (
      <div
        style={{
          display: "flex",
          gap,
          alignItems: "stretch", // ✅ مهم: يخلي كل العناصر بنفس الارتفاع
          overflowX: "auto",
          overflowY: "visible",
          paddingBottom: 8,
          paddingRight: gap,
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {items.map((child, i) => (
          <div
            key={i}
            style={{
              flex: `0 0 ${cardWidth}px`, // ✅ ثبات حقيقي
              scrollSnapAlign: "start",
              display: "flex", // ✅ يخلي الكارد يتمدد بالطول لو احتاج
            }}
          >
            {child}
          </div>
        ))}
      </div>
    );
  }