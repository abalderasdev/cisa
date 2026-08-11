export function WhatsAppFAB() {
  return (
    <a
      href="https://wa.me/525517964940?text=Hola%20Grupo%20CISA%2C%20me%20interesa%20conocer%20m%C3%A1s."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      className="fab-whatsapp"
      style={{
        position: "fixed",
        right: 20,
        bottom: 20,
        zIndex: 100,
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: "var(--color-whatsapp)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 14px rgba(15, 20, 25, 0.20)",
        transition: "transform 200ms, box-shadow 200ms",
      }}
    >
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path fillRule="evenodd" clipRule="evenodd" d="M16 3C8.82 3 3 8.82 3 16c0 2.28.59 4.42 1.62 6.27L3 29l6.93-1.59A12.95 12.95 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3Zm0 23.6a10.6 10.6 0 0 1-5.4-1.47l-.39-.23-4.11.94.96-4.01-.25-.41A10.6 10.6 0 1 1 26.6 16 10.6 10.6 0 0 1 16 26.6Zm5.81-7.93c-.32-.16-1.88-.93-2.17-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.04-1 1.25-.18.21-.37.24-.69.08-.32-.16-1.34-.49-2.55-1.57-.94-.84-1.58-1.88-1.76-2.2-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.18.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.71-.97-2.34-.26-.62-.52-.53-.71-.54l-.61-.01a1.17 1.17 0 0 0-.85.4c-.29.32-1.12 1.09-1.12 2.66 0 1.57 1.14 3.08 1.3 3.29.16.21 2.25 3.44 5.45 4.83.76.33 1.36.53 1.82.68.76.24 1.46.21 2.01.13.61-.09 1.88-.77 2.15-1.51.27-.74.27-1.38.19-1.51-.08-.13-.29-.21-.61-.37Z" fill="white"/>
      </svg>
    </a>
  );
}
