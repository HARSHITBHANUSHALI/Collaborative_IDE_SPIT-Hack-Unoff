const ENTITY_TYPES = [
    "PERSON",
    "EMAIL_ADDRESS",
    "PHONE_NUMBER",
    "CREDIT_CARD",
    "CRYPTO",
    "DOMAIN_NAME",
    "IP_ADDRESS",
    "DATE_TIME",
    "NRP",
    "LOCATION",
    "MEDICAL_LICENSE",
    "URL",
    "ORGANIZATION"
  ];
  
  // Language options
  const LANGUAGE_OPTIONS = [
    { value: "en", label: "English" },
    { value: "hi", label: "Hindi" },
    { value: "mr", label: "Marathi" }
  ];
  
  // File type mapping
  const FILE_TYPES = [
    "csv", "json", "xlsx", "pdf", "docx",
    "png", "jpg", "jpeg"
  ];
  
  export { ENTITY_TYPES, LANGUAGE_OPTIONS, FILE_TYPES };