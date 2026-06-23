export interface TranslationDict {
  appName: string;
  appSubtitle: string;
  refreshBtn: string;
  refreshing: string;
  searchPlaceholder: string;
  allGenres: string;
  filterByCountry: string;
  allCountries: string;
  
  // Navigation
  navBands: string;
  navFestivals: string;
  navShows: string;
  navNews: string;
  navMerch: string;
  navHelp: string;
  navAdmin: string;
  navMonetization: string;

  // Language selectors
  langPT: string;
  langEN: string;
  langES: string;

  // User Stats
  statsTitle: string;
  statsOnline: string;
  statsRegistered: string;

  // Band lists and cards
  formationYear: string;
  originCountry: string;
  granularGenre: string;
  members: string;
  discography: string;
  contactsHeader: string;
  socialsHeader: string;
  noBandsFound: string;
  approvedText: string;
  pendingText: string;
  submitBandBtn: string;
  aiCompleteBtn: string;
  aiCompleting: string;

  // Festivals & Shows lists
  countdownTitle: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  buyTickets: string;
  festivalBanner: string;
  localShowsTitle: string;
  noEventsFound: string;
  lineup: string;

  // News
  newsTab: string;
  noNewsFound: string;
  readMore: string;

  // Merch
  merchTitle: string;
  merchSubtitle: string;
  buyMerchBtn: string;

  // Help & Tutorial
  helpTitle: string;
  helpWelcome: string;
  faqTitle: string;
  contactDeveloperTitle: string;
  contactDeveloperText: string;

  // Auth Panel
  loginTitle: string;
  registerTitle: string;
  emailLabel: string;
  passwordLabel: string;
  confirmPasswordLabel: string;
  forgotPasswordLabel: string;
  changePasswordLabel: string;
  newPasswordLabel: string;
  loginBtn: string;
  registerBtn: string;
  logoutBtn: string;
  forgotPasswordBtn: string;
  changePasswordBtn: string;
  orText: string;
  dontHaveAccount: string;
  alreadyHaveAccount: string;
  guestModeBtn: string;
  authSuccessMsg: string;
  authErrorMsg: string;

  // Forms / Submissions
  submitBandTitle: string;
  submitEventTitle: string;
  submitNewsTitle: string;
  submitMerchTitle: string;
  bandNameField: string;
  bandGenreField: string;
  bandCountryField: string;
  bandYearField: string;
  bandBioField: string;
  bandLogoField: string;
  bandMembersField: string;
  bandDiscographyField: string;
  bandMembersPlaceholder: string;
  bandDiscographyPlaceholder: string;
  addBtn: string;
  saveBtn: string;
  cancelBtn: string;
  successSubmitted: string;

  // Admin section
  adminDashboard: string;
  adminWelcome: string;
  pendingValidation: string;
  approveBtn: string;
  deleteBtn: string;
  editBtn: string;
  noPendingItems: string;
  onlyAdminPrompt: string;

  // Monetization Section
  monetizeTitle: string;
  monetizeSubtitle: string;
  monetizeIntro: string;
}

export const translations: { [lang: string]: TranslationDict } = {
  pt: {
    appName: "MetalZone",
    appSubtitle: "O Epicentro Mundial de Rock & Heavy Metal",
    refreshBtn: "Atualizar",
    refreshing: "Sincronizando...",
    searchPlaceholder: "Pesquisar bandas, subgêneros (ex: death metal)...",
    allGenres: "Todos os Subgêneros de Metal",
    filterByCountry: "Filtrar por País",
    allCountries: "Todos os Países",
    
    navBands: "Bandas",
    navFestivals: "Festivais",
    navShows: "Shows",
    navNews: "Notícias",
    navMerch: "Merchandising",
    navHelp: "Ajuda & Tutorial",
    navAdmin: "Painel Admin",
    navMonetization: "Dicas de Monetização",

    langPT: "Português (BR)",
    langEN: "English (EN)",
    langES: "Español (ES)",

    statsTitle: "Comunidade MetalZone",
    statsOnline: "Metalheads Online",
    statsRegistered: "Membros Cadastrados",

    formationYear: "Ano de Formação",
    originCountry: "País de Origem",
    granularGenre: "Subgênero Específico",
    members: "Integrantes",
    discography: "Discografia (Álbuns & EPs)",
    contactsHeader: "Contatos para Shows",
    socialsHeader: "Redes Sociais",
    noBandsFound: "Nenhuma banda de metal encontrada para estes filtros.",
    approvedText: "Catálogo Oficial",
    pendingText: "Pendente de Aprovação pelo Admin",
    submitBandBtn: "Cadastrar Nova Banda",
    aiCompleteBtn: "Preencher tudo com IA (Gemini)",
    aiCompleting: "Consultando enciclopédia de metal...",

    countdownTitle: "Contagem Regressiva para o Metal",
    days: "Dias",
    hours: "Horas",
    minutes: "Mins",
    seconds: "Segs",
    buyTickets: "Garantir Ingressos",
    festivalBanner: "Festivais de Rock & Metal Mundiais",
    localShowsTitle: "Próximos Shows & Turnês",
    noEventsFound: "Nenhum evento ou festival cadastrado no momento.",
    lineup: "Line-up / Bandas Confirmadas",

    newsTab: "Notícias e Novidades do Heavy Metal",
    noNewsFound: "Nenhuma notícia publicada ainda.",
    readMore: "Ler Notícia Completa",

    merchTitle: "Merchandising Exclusivo Patrício",
    merchSubtitle: "Produtos premium selecionados diretamente para o seu estilo de vida headbanger",
    buyMerchBtn: "Garantir com o Desenvolvedor (WhatsApp)",

    helpTitle: "Ajuda & Suporte",
    helpWelcome: "Seja bem-vindo ao MetalZone! Saiba como utilizar a plataforma mundial do Heavy Metal:",
    faqTitle: "Perguntas Frequentes (FAQ)",
    contactDeveloperTitle: "Entrar em Contato com o Desenvolvedor",
    contactDeveloperText: "Problemas, dúvidas, propostas de parcerias e patrocínio? Converse diretamente com Patrício!",

    loginTitle: "Entrar na MetalZone",
    registerTitle: "Criar Conta de Usuário",
    emailLabel: "Endereço de E-mail",
    passwordLabel: "Senha Secreta",
    confirmPasswordLabel: "Confirmar Senha",
    forgotPasswordLabel: "Esqueceu a senha?",
    changePasswordLabel: "Alterar Senha de Segurança",
    newPasswordLabel: "Nova Senha",
    loginBtn: "Entrar",
    registerBtn: "Cadastrar Conta",
    logoutBtn: "Sair do Aplicativo",
    forgotPasswordBtn: "Enviar Link de Recuperação",
    changePasswordBtn: "Atualizar Senha",
    orText: "ou continue como",
    dontHaveAccount: "Não tem uma conta?",
    alreadyHaveAccount: "Já possui cadastro?",
    guestModeBtn: "Modo Visitante (Sem Login)",
    authSuccessMsg: "Operação de autenticação realizada com sucesso!",
    authErrorMsg: "Erro de autenticação: verifique os campos informados.",

    submitBandTitle: "Propor Banda ao Catálogo",
    submitEventTitle: "Cadastrar Shows ou Festival",
    submitNewsTitle: "Redigir Notícia de Heavy Metal",
    submitMerchTitle: "Adicionar Item de Merch (Apenas Admin)",
    bandNameField: "Nome da Banda",
    bandGenreField: "Estilo Ultra Específico (ex: Atmospheric Doom Metal)",
    bandCountryField: "País",
    bandYearField: "Ano de Fundação",
    bandBioField: "História / Biografia da Banda",
    bandLogoField: "URL do Logotipo (deixe vazio para imagem padrão)",
    bandMembersField: "Integrantes (Nome; Função, status; ex: Chuck; Guitarra, active)",
    bandDiscographyField: "Discografia (Álbum; Ano, Álbum; ex: Nightfall; 1987, Album)",
    bandMembersPlaceholder: "Ex: Bruce Dickinson; Vocal, active (uma linha por integrante)",
    bandDiscographyPlaceholder: "Ex: Powerslave; 1984, Album (uma linha por disco)",
    addBtn: "Adicionar Item",
    saveBtn: "Enviar para Aprovação",
    cancelBtn: "Cancelar",
    successSubmitted: "Cadastrado enviado! Aguardando moderação de Patrício.",

    adminDashboard: "Painel Superior do Administrador",
    adminWelcome: "Bem-vindo, Patrício! Você tem controle absoluto para aprovar, editar ou deletar itens do catálogo mundial.",
    pendingValidation: "Solicitações Pendentes de Sua Moderação",
    approveBtn: "Aprovar e Publicar",
    deleteBtn: "Excluir Definitivamente",
    editBtn: "Editar Detalhes",
    noPendingItems: "Não há solicitações pendentes no momento. Tudo limpo!",
    onlyAdminPrompt: "Área exclusiva para o administrador patricioaug@gmail.com",

    monetizeTitle: "Estratégias de Negócio & Monetização",
    monetizeSubtitle: "Como transformar o MetalZone no maior portal B2B do cenário de Heavy Metal e gerar lucros extraordinários",
    monetizeIntro: "Com uma comunidade altamente engajada e apaixonada por bandas de heavy metal, o MetalZone oferece excelentes janelas de lucro:"
  },
  en: {
    appName: "MetalZone",
    appSubtitle: "The Global Epicenter of Heavy Metal & Rock",
    refreshBtn: "Refresh",
    refreshing: "Synchronizing...",
    searchPlaceholder: "Search bands, specific subgenres (e.g. death metal)...",
    allGenres: "All Metal Subgenres",
    filterByCountry: "Filter by Country",
    allCountries: "All Countries",
    
    navBands: "Bands",
    navFestivals: "Festivals",
    navShows: "Shows",
    navNews: "News",
    navMerch: "Merchandise",
    navHelp: "Help & Tutorial",
    navAdmin: "Admin Panel",
    navMonetization: "Monetization Tips",

    langPT: "Português (BR)",
    langEN: "English (EN)",
    langES: "Español (ES)",

    statsTitle: "MetalZone Community",
    statsOnline: "Metalheads Online",
    statsRegistered: "Registered Members",

    formationYear: "Formation Year",
    originCountry: "Country of Origin",
    granularGenre: "Granular Subgenre",
    members: "Members",
    discography: "Discography (Albums & EPs)",
    contactsHeader: "Booking Contacts",
    socialsHeader: "Social Networks",
    noBandsFound: "No extreme metal bands found matching these criteria.",
    approvedText: "Official Catalog",
    pendingText: "Pending Admin Approval",
    submitBandBtn: "Register New Band",
    aiCompleteBtn: "Fill everything with IA (Gemini)",
    aiCompleting: "Querying ancestral metal encyclopedia...",

    countdownTitle: "Metal Countdown In Progress",
    days: "Days",
    hours: "Hours",
    minutes: "Mins",
    seconds: "Secs",
    buyTickets: "Secure Tickets",
    festivalBanner: "World Rock & Heavy Metal Festivals",
    localShowsTitle: "Upcoming Shows & Tours",
    noEventsFound: "No concerts or festivals registered yet.",
    lineup: "Line-up / Confirmed Bands",

    newsTab: "Heavy Metal News & Releases",
    noNewsFound: "No news articles posted yet.",
    readMore: "Read Full Article",

    merchTitle: "Patrício's Exclusive Merchandise",
    merchSubtitle: "Selected premium items designed specifically for the headbanger lifestyle",
    buyMerchBtn: "Order via WhatsApp with Dev",

    helpTitle: "Help & Support",
    helpWelcome: "Welcome to MetalZone! Discover how to easily master the global Heavy Metal portal:",
    faqTitle: "Frequently Asked Questions (FAQ)",
    contactDeveloperTitle: "Contact the Developer Behind the Portal",
    contactDeveloperText: "Any issues, questions, partnership proposals, or sponsorships? Talk directly with Patrício!",

    loginTitle: "Log In to MetalZone",
    registerTitle: "Create User Account",
    emailLabel: "Email Address",
    passwordLabel: "Secret Password",
    confirmPasswordLabel: "Confirm Password",
    forgotPasswordLabel: "Forgot your password?",
    changePasswordLabel: "Update Security Password",
    newPasswordLabel: "New Password",
    loginBtn: "Login",
    registerBtn: "Register Account",
    logoutBtn: "Log Out",
    forgotPasswordBtn: "Send Reset Link",
    changePasswordBtn: "Update Password",
    orText: "or continue as",
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: "Already registered?",
    guestModeBtn: "Guest Mode (No Login)",
    authSuccessMsg: "Authentication request performed successfully!",
    authErrorMsg: "Authentication error: please verify your credentials.",

    submitBandTitle: "Submit Band to Catalog",
    submitEventTitle: "Register Concerts or Festival",
    submitNewsTitle: "Draft Heavy Metal News",
    submitMerchTitle: "Add Merch Item (Admin Only)",
    bandNameField: "Band Name",
    bandGenreField: "Ultra Specific Style (e.g., Melodic Death Metal)",
    bandCountryField: "Country",
    bandYearField: "Foundation Year",
    bandBioField: "History / Band Biography",
    bandLogoField: "Logotype URL (leave empty for custom backup illustration)",
    bandMembersField: "Members (Name; Instrument, status; e.g. Chuck; Guitar, active)",
    bandDiscographyField: "Discography (Album; Year, Album; e.g. Nightfall; 1987, Album)",
    bandMembersPlaceholder: "E.g. Bruce Dickinson; Vocals, active (one member per line)",
    bandDiscographyPlaceholder: "E.g. Powerslave; 1984, Album (one record per line)",
    addBtn: "Add Item",
    saveBtn: "Submit for Approval",
    cancelBtn: "Cancel",
    successSubmitted: "Submitted successfully! Awaiting Patrício's curation review.",

    adminDashboard: "Master Administrator Dashboard",
    adminWelcome: "Welcome back, Patrício! You have full access to approve, revise, or delete all portal database entries.",
    pendingValidation: "Awaiting Your Review",
    approveBtn: "Approve & Publish Live",
    deleteBtn: "Delete Permanently",
    editBtn: "Edit Details",
    noPendingItems: "No pending submissions left to review. Great job!",
    onlyAdminPrompt: "Exclusive area reserved for patricioaug@gmail.com",

    monetizeTitle: "Business Strategy & Monetization",
    monetizeSubtitle: "How to scale MetalZone into the ultimate heavy metal B2B powerhouse and generate passive cashflow",
    monetizeIntro: "Targeting an incredibly passionate niche community, MetalZone has highly lucrative advertising and sponsorship hooks:"
  },
  es: {
    appName: "MetalZone",
    appSubtitle: "El Epicentro Mundial del Rock y Heavy Metal",
    refreshBtn: "Actualizar",
    refreshing: "Sincronizando...",
    searchPlaceholder: "Buscar bandas, subgéneros ultra específicos (ej: doom metal)...",
    allGenres: "Todos los Subgéneros de Metal",
    filterByCountry: "Filtrar por País",
    allCountries: "Todos los Países",
    
    navBands: "Bandas",
    navFestivals: "Festivales",
    navShows: "Conciertos",
    navNews: "Noticias",
    navMerch: "Merchandise",
    navHelp: "Ayuda & Tutorial",
    navAdmin: "Panel Admin",
    navMonetization: "Ideas de Monetización",

    langPT: "Português (BR)",
    langEN: "English (EN)",
    langES: "Español (ES)",

    statsTitle: "Comunidad MetalZone",
    statsOnline: "Metalheads Online",
    statsRegistered: "Miembros Registrados",

    formationYear: "Año de Formación",
    originCountry: "País de Origen",
    granularGenre: "Subgénero Específico",
    members: "Integrantes",
    discography: "Discografía (Álbumes y EPs)",
    contactsHeader: "Contactos para Shows",
    socialsHeader: "Redes Sociales",
    noBandsFound: "Ninguna banda de metal coincide con los filtros.",
    approvedText: "Catálogo Oficial",
    pendingText: "Pendiente de Aprobación por Admin",
    submitBandBtn: "Registrar Nueva Banda",
    aiCompleteBtn: "Completar todo con IA (Gemini)",
    aiCompleting: "Consultando enciclopedia de metal ancestral...",

    countdownTitle: "Cuenta Regresiva para el Metal",
    days: "Días",
    hours: "Horas",
    minutes: "Mins",
    seconds: "Segs",
    buyTickets: "Garantizar Entradas",
    festivalBanner: "Festivales de Rock & Metal del Mundo",
    localShowsTitle: "Próximos Conciertos y Giras",
    noEventsFound: "No hay eventos o festivales registrados por el momento.",
    lineup: "Line-up / Bandas Confirmadas",

    newsTab: "Noticias del Mundo del Heavy Metal",
    noNewsFound: "No se ha publicado ninguna noticia todavía.",
    readMore: "Leer Artículo Completo",

    merchTitle: "Merchandise Oficial de Patrício",
    merchSubtitle: "Productos de calidad seleccionados directamente para el headbanger de hueso colorado",
    buyMerchBtn: "Pedir al Desarrollador por WhatsApp",

    helpTitle: "Ayuda y Soporte",
    helpWelcome: "¡Bienvenido a MetalZone! Sigue estos sencillos pasos para dominar el portal global del Metal:",
    faqTitle: "Preguntas Frecuentes (FAQ)",
    contactDeveloperTitle: "Contactar con el Creador",
    contactDeveloperText: "¿Problemas, dudas, propuestas comerciales o patrocinio? Hable directamente con Patrício.",

    loginTitle: "Ingresar a MetalZone",
    registerTitle: "Crear Cuenta de Usuario",
    emailLabel: "Correo Electrónico",
    passwordLabel: "Contraseña Secreta",
    confirmPasswordLabel: "Confirmar Contraseña",
    forgotPasswordLabel: "¿Olvidaste tu contraseña?",
    changePasswordLabel: "Cambiar Contraseña de Seguridad",
    newPasswordLabel: "Nueva Contraseña",
    loginBtn: "Iniciar Sesión",
    registerBtn: "Registrar Cuenta",
    logoutBtn: "Cerrar Sesión",
    forgotPasswordBtn: "Enviar Enlace de Recuperación",
    changePasswordBtn: "Cambiar Contraseña",
    orText: "o continúa como",
    dontHaveAccount: "¿No tienes una cuenta?",
    alreadyHaveAccount: "¿Ya tienes cuenta?",
    guestModeBtn: "Modo Invitado (Sin Cuenta)",
    authSuccessMsg: "¡Autenticación completada con éxito!",
    authErrorMsg: "Error de autenticación: revise los datos del formulario.",

    submitBandTitle: "Proponer Banda al Catálogo",
    submitEventTitle: "Registrar Concierto o Festival",
    submitNewsTitle: "Redactar Noticia de Heavy Metal",
    submitMerchTitle: "Agregar Item de Merch (Admin)",
    bandNameField: "Nombre de la Banda",
    bandGenreField: "Estilo Ultra Específico (ej. Melodic Death Metal)",
    bandCountryField: "País",
    bandYearField: "Año de Fundación",
    bandBioField: "Historia / Biografía de la Banda",
    bandLogoField: "URL de Logotipo (vacío para imagen predeterminada)",
    bandMembersField: "Integrantes (Nombre; Función, status; ej: Chuck; Guitarra, active)",
    bandDiscographyField: "Discografía (Álbum; Año, Álbum; ej: Nightfall; 1987, Album)",
    bandMembersPlaceholder: "Ej: Bruce Dickinson; Voz, active (un integrante por línea)",
    bandDiscographyPlaceholder: "Ej: Powerslave; 1984, Album (un disco por línea)",
    addBtn: "Agregar Item",
    saveBtn: "Enviar para Aprobación",
    cancelBtn: "Cancelar",
    successSubmitted: "¡Información enviada! En espera de aprobación por Patrício.",

    adminDashboard: "Panel Supremo de Mando Administrador",
    adminWelcome: "¡Hola, Patrício! Acceso completo para autorizar, editar o borrar contenido de la base de datos.",
    pendingValidation: "Solicitudes Pendientes de Moderación",
    approveBtn: "Aprovar y Publicar",
    deleteBtn: "Eliminar de la Base",
    editBtn: "La Gesta / Editar Detalles",
    noPendingItems: "No hay solicitudes pendientes en este momento. ¡Todo limpio!",
    onlyAdminPrompt: "Área reservada exclusivamente para patricioaug@gmail.com",

    monetizeTitle: "Estrategias de Negocio y Monetización",
    monetizeSubtitle: "Cómo transformar MetalZone en la mayor red publicitaria B2B de Metal y generar ingresos pasivos",
    monetizeIntro: "Un nicho tan apasionado presenta impresionantes oportunidades de marketing y patrocinio con marcas premium:"
  }
};
