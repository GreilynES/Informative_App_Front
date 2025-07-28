// models/Services.ts
export interface ModalContent {
  title: string
  description: string
  image: string
}

export interface Service {
  title: string
  cardDescription: string
  modalDescription: string
  image: string
}

export const services: Service[] = [
  {
    title: "Capacitación y transferencia",
    cardDescription: "Lorem ipsum dolor sit amet consectetur adipiscing elit habitasse nibh, facilisi ullamcorper magnis justo metus maecenas fermentum erat tortor, in facilisis taciti scelerisque pretium malesuada a purus. Facilisis non nostra lacinia etiam eget sociosqu tempus senectus, integer praesent elementum morbi litora natoque commodo netus leo, vulputate rutrum varius duis aptent dictumst torquent. ",
    modalDescription: "Lorem ipsum dolor sit amet consectetur adipiscing elit habitasse nibh, facilisi ullamcorper magnis justo metus maecenas fermentum erat tortor, in facilisis taciti scelerisque pretium malesuada a purus. Facilisis non nostra lacinia etiam eget sociosqu tempus senectus, integer praesent elementum morbi litora natoque commodo netus leo, vulputate rutrum varius duis aptent dictumst torquent. Parturient augue suscipit egestas aenean primis cubilia tempor nostra purus, lobortis pellentesque sollicitudin vel sem tortor eget turpis maecenas fames, erat elementum et ac at nulla accumsan justo. Libero litora porttitor himenaeos accumsan placerat sollicitudin nullam ante lacinia, fames elementum magnis cursus sociis vehicula facilisis ac nunc ultricies, metus nulla ullamcorper ut dui consequat dictum odio. Primis vivamus nostra montes per enim bibendum sollicitudin lacus tellus auctor id mi posuere eleifend, phasellus inceptos hac purus et leo feugiat porttitor nascetur cubilia duis metus. Aliquam ridiculus sagittis duis cum justo erat fringilla platea venenatis nostra at, maecenas himenaeos lacinia faucibus libero augue massa morbi nibh.",
    image: "https://scontent.fsjo10-1.fna.fbcdn.net/v/t39.30808-6/482000334_571803125909150_7851598428227402418_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_ohc=01jFx4XBIMkQ7kNvwHAAqZS&_nc_oc=AdnkECuW7sVhMVDaM8Y0ujC3IKTJL_eksa8ErZVrix40ZkfjUW3JH2sOuQYD705jGOI&_nc_zt=23&_nc_ht=scontent.fsjo10-1.fna&_nc_gid=jxmr0kBgv9_wBt1imUay7w&oh=00_AfRUPDFZptbfTmmAk8uikLHtqMg0RBStKmnWs6_WY2QM4A&oe=687F373A",
  },
  {
    title: "Asistencia técnica",
    cardDescription: "Lorem ipsum dolor sit amet consectetur adipiscing elit habitasse nibh,",
    modalDescription: "Nuestro equipo técnico visita fincas, evalúa procesos y brinda asesoramiento directo sobre sanidad animal, nutrición, genética y manejo sostenible.",
    image: "https://scontent.fsjo10-1.fna.fbcdn.net/v/t39.30808-6/468735561_500353246387472_7430796887605064981_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=u8Kp6TsfmVIQ7kNvwHOanRA&_nc_oc=Adn3xnKfy-v5JbCOFzil8aEB_0g7Vw5mrkIuKVfjVQ_Ki7Oqxw4K2a5JutYj-gPF9Bc&_nc_zt=23&_nc_ht=scontent.fsjo10-1.fna&_nc_gid=Lm4N33vv_yeBXRKKEpbJkg&oh=00_AfRC4BHg9JPKlt6Wyz5p_gRutkvl02sx8wTq6BnICZ5e5w&oe=687F18F4",
  },
  {
    title: "Innovación rural",
    cardDescription: "Lorem ipsum dolor sit amet consectetur adipiscing elit habitasse nibh, facilisi ullamcorper magnis justo metus maecenas fermentum erat tortor, in facilisis taciti scelerisque pretium malesuada a purus.",
    modalDescription: "Apoyamos la implementación de soluciones tecnológicas como cercas eléctricas, sistemas de captación de agua, monitoreo satelital y aplicaciones móviles para el manejo eficiente de la producción.",
    image: "https://scontent.fsjo10-1.fna.fbcdn.net/v/t39.30808-6/480681953_559776447111818_994803168973652271_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_ohc=2C0C-HD-yqIQ7kNvwGVGsMm&_nc_oc=AdmW3WOYC7xD2T-swz9HyDq4oSyt7_hd2TRm5rg6xZhVkO_U-lXDTc-Jo8Qv-m3jG9E&_nc_zt=23&_nc_ht=scontent.fsjo10-1.fna&_nc_gid=m0INk5YFw5Lmtfxc8ujENw&oh=00_AfQhn5mcIhv5dHQ6mJl29bl9qtm8HAJdvclfzXOwEhS8dw&oe=687F4222",
  },
  {
    title: "Innovación rural",
    cardDescription: "Lorem ipsum dolor sit amet consectetur adipiscing elit habitasse nibh, facilisi ullamcorper magnis justo metus maecenas fermentum erat tortor, in facilisis taciti scelerisque pretium malesuada a purus.",
    modalDescription: "Apoyamos la implementación de soluciones tecnológicas como cercas eléctricas, sistemas de captación de agua, monitoreo satelital y aplicaciones móviles para el manejo eficiente de la producción.",
    image: "https://scontent.fsjo10-1.fna.fbcdn.net/v/t39.30808-6/480681953_559776447111818_994803168973652271_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_ohc=2C0C-HD-yqIQ7kNvwGVGsMm&_nc_oc=AdmW3WOYC7xD2T-swz9HyDq4oSyt7_hd2TRm5rg6xZhVkO_U-lXDTc-Jo8Qv-m3jG9E&_nc_zt=23&_nc_ht=scontent.fsjo10-1.fna&_nc_gid=m0INk5YFw5Lmtfxc8ujENw&oh=00_AfQhn5mcIhv5dHQ6mJl29bl9qtm8HAJdvclfzXOwEhS8dw&oe=687F4222",
  },
  {
    title: "Innovación rural",
    cardDescription: "Lorem ipsum dolor sit amet consectetur adipiscing elit habitasse nibh, facilisi ullamcorper magnis justo metus maecenas fermentum erat tortor, in facilisis taciti scelerisque pretium malesuada a purus.",
    modalDescription: "Apoyamos la implementación de soluciones tecnológicas como cercas eléctricas, sistemas de captación de agua, monitoreo satelital y aplicaciones móviles para el manejo eficiente de la producción.",
    image: "https://scontent.fsjo10-1.fna.fbcdn.net/v/t39.30808-6/480681953_559776447111818_994803168973652271_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_ohc=2C0C-HD-yqIQ7kNvwGVGsMm&_nc_oc=AdmW3WOYC7xD2T-swz9HyDq4oSyt7_hd2TRm5rg6xZhVkO_U-lXDTc-Jo8Qv-m3jG9E&_nc_zt=23&_nc_ht=scontent.fsjo10-1.fna&_nc_gid=m0INk5YFw5Lmtfxc8ujENw&oh=00_AfQhn5mcIhv5dHQ6mJl29bl9qtm8HAJdvclfzXOwEhS8dw&oe=687F4222",
  },
  {
    title: "Innovación rural",
    cardDescription: "Lorem ipsum dolor sit amet consectetur adipiscing elit habitasse nibh, facilisi ullamcorper magnis justo metus maecenas fermentum erat tortor, in facilisis taciti scelerisque pretium malesuada a purus.",
    modalDescription: "Apoyamos la implementación de soluciones tecnológicas como cercas eléctricas, sistemas de captación de agua, monitoreo satelital y aplicaciones móviles para el manejo eficiente de la producción.",
    image: "https://scontent.fsjo10-1.fna.fbcdn.net/v/t39.30808-6/480681953_559776447111818_994803168973652271_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_ohc=2C0C-HD-yqIQ7kNvwGVGsMm&_nc_oc=AdmW3WOYC7xD2T-swz9HyDq4oSyt7_hd2TRm5rg6xZhVkO_U-lXDTc-Jo8Qv-m3jG9E&_nc_zt=23&_nc_ht=scontent.fsjo10-1.fna&_nc_gid=m0INk5YFw5Lmtfxc8ujENw&oh=00_AfQhn5mcIhv5dHQ6mJl29bl9qtm8HAJdvclfzXOwEhS8dw&oe=687F4222",
  },
  {
    title: "Innovación rural",
    cardDescription: "Lorem ipsum dolor sit amet consectetur adipiscing elit habitasse nibh, facilisi ullamcorper magnis justo metus maecenas fermentum erat tortor, in facilisis taciti scelerisque pretium malesuada a purus.",
    modalDescription: "Apoyamos la implementación de soluciones tecnológicas como cercas eléctricas, sistemas de captación de agua, monitoreo satelital y aplicaciones móviles para el manejo eficiente de la producción.",
    image: "https://scontent.fsjo10-1.fna.fbcdn.net/v/t39.30808-6/480681953_559776447111818_994803168973652271_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_ohc=2C0C-HD-yqIQ7kNvwGVGsMm&_nc_oc=AdmW3WOYC7xD2T-swz9HyDq4oSyt7_hd2TRm5rg6xZhVkO_U-lXDTc-Jo8Qv-m3jG9E&_nc_zt=23&_nc_ht=scontent.fsjo10-1.fna&_nc_gid=m0INk5YFw5Lmtfxc8ujENw&oh=00_AfQhn5mcIhv5dHQ6mJl29bl9qtm8HAJdvclfzXOwEhS8dw&oe=687F4222",
  },
  
  
]