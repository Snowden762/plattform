export default function LiveStream() {
  return (
    <div className="w-full h-64 bg-black flex items-center justify-center text-white">
      <video
        src="https://www.w3schools.com/html/mov_bbb.mp4"
        controls
        className="w-full h-full object-contain"
      />
    </div>
  );
}
