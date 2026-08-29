export const PROVINCES = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Islamabad Capital Territory",
  "Gilgit-Baltistan",
  "Azad Jammu & Kashmir"
]

export const CITIES_BY_PROVINCE: Record<string, string[]> = {
  "Punjab": [
    "Attock", "Bahawalpur", "Burewala", "Chakwal", "Chiniot", "Dera Ghazi Khan",
    "Faisalabad", "Gujranwala", "Gujrat", "Hafizabad", "Jhang", "Jhelum", "Kasur",
    "Khanewal", "Khushab", "Lahore", "Mandi Bahauddin", "Mianwali", "Multan", 
    "Muzaffargarh", "Nankana Sahib", "Narowal", "Okara", "Pakpattan", "Rahim Yar Khan", 
    "Rajanpur", "Rawalpindi", "Sahiwal", "Sargodha", "Sheikhupura", "Sialkot", 
    "Toba Tek Singh", "Vehari"
  ],
  "Sindh": [
    "Badin", "Dadu", "Ghotki", "Hyderabad", "Jacobabad", "Jamshoro", "Karachi",
    "Kashmore", "Khairpur", "Larkana", "Matiari", "Mirpur Khas", "Naushahro Feroze",
    "Nawabshah", "Qambar Shahdadkot", "Sanghar", "Shikarpur", "Sukkur", "Tando Allahyar",
    "Tando Muhammad Khan", "Tharparkar", "Thatta", "Umerkot"
  ],
  "Khyber Pakhtunkhwa": [
    "Abbottabad", "Bannu", "Battagram", "Buner", "Charsadda", "Chitral", "Dera Ismail Khan",
    "Hangu", "Haripur", "Karak", "Kohat", "Kohistan", "Lakki Marwat", "Lower Dir", 
    "Malakand", "Mansehra", "Mardan", "Nowshera", "Peshawar", "Shangla", "Swabi", 
    "Swat", "Tank", "Torghar", "Upper Dir"
  ],
  "Balochistan": [
    "Awaran", "Barkhan", "Bolan", "Chagai", "Dera Bugti", "Gwadar", "Harnai", 
    "Jafarabad", "Jhal Magsi", "Kalat", "Kech", "Kharan", "Khuzdar", "Kohlu", 
    "Lasbela", "Loralai", "Mastung", "Musakhel", "Nasirabad", "Nushki", "Panjgur", 
    "Pishin", "Quetta", "Sherani", "Sibi", "Washuk", "Zhob", "Ziarat"
  ],
  "Islamabad Capital Territory": [
    "Islamabad"
  ],
  "Gilgit-Baltistan": [
    "Astore", "Diamer", "Ghanche", "Ghizer", "Gilgit", "Hunza", "Kharmang", "Nagar", "Shigar", "Skardu"
  ],
  "Azad Jammu & Kashmir": [
    "Bagh", "Bhimber", "Hattian Bala", "Haveli", "Kotli", "Mirpur", "Muzaffarabad", "Neelum", "Poonch", "Sudhanoti"
  ]
}

export const ALL_CITIES = Object.values(CITIES_BY_PROVINCE).flat().sort()
