import { helloWorld } from '@agri-scan/shared'; // <-- Đây là hàm lấy từ thư mục chung

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Agri-Scan AI Web</h1>
      <p className="mt-4 text-xl text-green-600">
        Shared Message: {helloWorld()} 
      </p>
    </div>
  );
}