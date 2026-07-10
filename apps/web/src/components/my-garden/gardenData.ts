// Dữ liệu MẪU cho danh mục "Cây hỗ trợ" trong My Garden (tabs FRUIT/FLOWER/ORNAMENTAL).
//
// ⚠️ Đây là dữ liệu tĩnh (mock) dùng cho catalog demo. Nguồn dữ liệu này bị mất
// khi migrate My Garden sang API thật; file được khôi phục để build không vỡ và
// tab danh mục vẫn hiển thị. TODO: thay bằng dữ liệu từ plant.service (backend).

export type GardenPlantGroup = "FRUIT" | "FLOWER" | "ORNAMENTAL";

export interface MockGardenPlant {
  id: string;
  group: GardenPlantGroup;
  name: string;
  species: string;
  image: string;
}

export const MOCK_PLANTS: MockGardenPlant[] = [
  // --- Cây ăn quả ---
  {
    id: "fruit-1",
    group: "FRUIT",
    name: "Cây Xoài",
    species: "Mangifera indica",
    image:
      "https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "fruit-2",
    group: "FRUIT",
    name: "Cây Ổi",
    species: "Psidium guajava",
    image:
      "https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?q=80&w=800&auto=format&fit=crop",
  },
  // --- Cây hoa ---
  {
    id: "flower-1",
    group: "FLOWER",
    name: "Hoa Hồng",
    species: "Rosa spp.",
    image:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "flower-2",
    group: "FLOWER",
    name: "Hoa Cúc",
    species: "Chrysanthemum morifolium",
    image:
      "https://images.unsplash.com/photo-1508610048659-a06b669e3321?q=80&w=800&auto=format&fit=crop",
  },
  // --- Cây kiểng ---
  {
    id: "ornamental-1",
    group: "ORNAMENTAL",
    name: "Cây Kim Tiền",
    species: "Zamioculcas zamiifolia",
    image:
      "https://images.unsplash.com/photo-1632207691143-643e2a9a9361?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "ornamental-2",
    group: "ORNAMENTAL",
    name: "Cây Lưỡi Hổ",
    species: "Sansevieria trifasciata",
    image:
      "https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?q=80&w=800&auto=format&fit=crop",
  },
];
