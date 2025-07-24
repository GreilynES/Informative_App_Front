import React, { useState } from "react";


interface ModalContent {
  title: string;
  description: string;
}

export default function ServicesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContent>({
    title: "",
    description: "",
  });

  const openModal = (title: string, description: string) => {
    setModalContent({ title, description });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const services = [
    {
      title: "Capacitación y transferencia",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      image:
        "https://scontent.fsjo10-1.fna.fbcdn.net/v/t39.30808-6/482000334_571803125909150_7851598428227402418_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_ohc=01jFx4XBIMkQ7kNvwHAAqZS&_nc_oc=AdnkECuW7sVhMVDaM8Y0ujC3IKTJL_eksa8ErZVrix40ZkfjUW3JH2sOuQYD705jGOI&_nc_zt=23&_nc_ht=scontent.fsjo10-1.fna&_nc_gid=jxmr0kBgv9_wBt1imUay7w&oh=00_AfRUPDFZptbfTmmAk8uikLHtqMg0RBStKmnWs6_WY2QM4A&oe=687F373A",
    },
    {
      title: "Suministro",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      image:
        "https://scontent.fsjo10-1.fna.fbcdn.net/v/t39.30808-6/468735561_500353246387472_7430796887605064981_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=u8Kp6TsfmVIQ7kNvwHOanRA&_nc_oc=Adn3xnKfy-v5JbCOFzil8aEB_0g7Vw5mrkIuKVfjVQ_Ki7Oqxw4K2a5JutYj-gPF9Bc&_nc_zt=23&_nc_ht=scontent.fsjo10-1.fna&_nc_gid=Lm4N33vv_yeBXRKKEpbJkg&oh=00_AfRC4BHg9JPKlt6Wyz5p_gRutkvl02sx8wTq6BnICZ5e5w&oe=687F18F4",
    },
    {
      title: "Centro de acopio de ganado",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      image:
        "https://scontent.fsjo10-1.fna.fbcdn.net/v/t39.30808-6/480681953_559776447111818_994803168973652271_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_ohc=2C0C-HD-yqIQ7kNvwGVGsMm&_nc_oc=AdmW3WOYC7xD2T-swz9HyDq4oSyt7_hd2TRm5rg6xZhVkO_U-lXDTc-Jo8Qv-m3jG9E&_nc_zt=23&_nc_ht=scontent.fsjo10-1.fna&_nc_gid=m0INk5YFw5Lmtfxc8ujENw&oh=00_AfQhn5mcIhv5dHQ6mJl29bl9qtm8HAJdvclfzXOwEhS8dw&oe=687F4222",
    },
  ];

  return (
    <div className="min-h-screen px-6 py-16 bg-gradient-to-br from-[#e7fef4] to-[#d9f4fa]">
      <h1 className="text-5xl font-bold text-center text-gray-900 mb-14 tracking-tight">
        Nuestros Servicios
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {services.map((service, idx) => (
          <div
            key={idx}
            className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-xl rounded-3xl overflow-hidden hover:scale-105 transition-transform duration-300 flex flex-col"
          >
            {/* Imagen */}
            <div className="h-64 w-full overflow-hidden">
              <img
                src={service.image}
                alt={service.title}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Título */}
            <div className="p-6 flex flex-col flex-grow justify-between">
              <h3 className="text-xl font-semibold text-center text-gray-800 mb-6">
                {service.title}
              </h3>

              {/* Botón */}
              <button
                onClick={() => openModal(service.title, service.description)}
                className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-6 py-2 rounded-xl hover:scale-105 transition-all duration-300 w-full shadow-md flex items-center justify-center gap-2"
              >
                Ver Más
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white/90 backdrop-blur-xl border border-white/30 rounded-xl p-8 max-w-xl w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              {modalContent.title}
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              {modalContent.description}
            </p>
            <div className="text-right">
              <button
                onClick={closeModal}
                className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}