import { storage } from "./storage";
import type {
  InsertChallenge,
  InsertReward,
  InsertAchievement,
  InsertQuestion,
} from "@shared/schema";

// Seed Challenges
async function seedChallenges() {
  const challenges: InsertChallenge[] = [
    // Learning challenges
    {
      title: "🔢 Maestro de los Números",
      description: "Resuelve 10 problemas de matemáticas correctamente",
      xpReward: 150,
      category: "learning",
      difficulty: 2,
      durationDays: 2,
    },
    {
      title: "📚 Explorador de Cuentos",
      description: "Lee un cuento completo y cuenta lo que aprendiste",
      xpReward: 120,
      category: "learning",
      difficulty: 1,
      durationDays: 1,
    },
    // Creativity challenges
    {
      title: "🎨 Artista Creativo",
      description: "Crea un dibujo o pintura especial para tu familia",
      xpReward: 100,
      category: "creativity",
      difficulty: 1,
      durationDays: 1,
    },
    {
      title: "🎵 Cantante Estrella",
      description: "Aprende y canta una canción nueva",
      xpReward: 130,
      category: "creativity",
      difficulty: 2,
      durationDays: 2,
    },
    // Movement challenges
    {
      title: "⚽ Súper Deportista",
      description: "Haz ejercicio durante 30 minutos al día",
      xpReward: 150,
      category: "movement",
      difficulty: 2,
      durationDays: 1,
    },
    {
      title: "🤸 Gimnasta Alegre",
      description: "Practica saltos y estiramientos divertidos",
      xpReward: 110,
      category: "movement",
      difficulty: 1,
      durationDays: 1,
    },
    // Tasks challenges
    {
      title: "🧹 Ayudante del Hogar",
      description: "Ayuda a ordenar tu cuarto y guardar tus juguetes",
      xpReward: 100,
      category: "tasks",
      difficulty: 1,
      durationDays: 1,
    },
    {
      title: "📋 Organizador Experto",
      description: "Mantén tu escritorio ordenado durante toda la semana",
      xpReward: 180,
      category: "tasks",
      difficulty: 3,
      durationDays: 2,
    },
    // Science challenges
    {
      title: "🔬 Científico Curioso",
      description: "Observa y dibuja 5 cosas interesantes de la naturaleza",
      xpReward: 140,
      category: "science",
      difficulty: 2,
      durationDays: 2,
    },
    {
      title: "🌱 Explorador Natural",
      description: "Planta una semilla y cuida de ella cada día",
      xpReward: 200,
      category: "science",
      difficulty: 3,
      durationDays: 2,
    },
  ];

  for (const challenge of challenges) {
    await storage.createChallenge(challenge);
  }
  console.log(`✅ Seeded ${challenges.length} challenges`);
}

// Seed Rewards
async function seedRewards() {
  const rewards: InsertReward[] = [
    // Small rewards (250-500 points)
    {
      title: "🍦 Helado Delicioso",
      description: "¡Elige tu sabor favorito de helado!",
      pointsRequired: 250,
      category: "treat",
    },
    {
      title: "🎮 15 Minutos Extra de Videojuegos",
      description: "Tiempo adicional para jugar tus videojuegos favoritos",
      pointsRequired: 300,
      category: "screen-time",
    },
    {
      title: "🎪 Elegir la Cena",
      description: "Tú eliges qué comer en la cena de hoy",
      pointsRequired: 400,
      category: "privilege",
    },
    {
      title: "🎨 Kit de Stickers",
      description: "Un set nuevo de stickers divertidos",
      pointsRequired: 500,
      category: "item",
    },
    // Medium rewards (700-1200 points)
    {
      title: "📖 Libro Nuevo",
      description: "Visita a la librería y elige un libro que te guste",
      pointsRequired: 700,
      category: "educational",
    },
    {
      title: "🎬 Película Familiar",
      description: "Noche de película con palomitas y toda la familia",
      pointsRequired: 800,
      category: "activity",
    },
    {
      title: "🎲 Juego de Mesa Nuevo",
      description: "Un juego de mesa divertido para toda la familia",
      pointsRequired: 1000,
      category: "item",
    },
    {
      title: "🎨 Kit de Arte",
      description: "Set de materiales de arte: colores, pinturas, y más",
      pointsRequired: 1200,
      category: "item",
    },
    // Large rewards (1500-2000 points)
    {
      title: "🧸 Juguete Especial",
      description: "El juguete que has estado deseando",
      pointsRequired: 1500,
      category: "item",
    },
    {
      title: "🎡 Día en el Parque",
      description: "Un día divertido en el parque de diversiones",
      pointsRequired: 1800,
      category: "activity",
    },
    {
      title: "⚽ Clase Especial",
      description: "Clase de tu actividad favorita: deporte, arte, música, etc.",
      pointsRequired: 2000,
      category: "educational",
    },
  ];

  for (const reward of rewards) {
    await storage.createReward(reward);
  }
  console.log(`✅ Seeded ${rewards.length} rewards`);
}

// Seed Achievements
async function seedAchievements() {
  const achievements: InsertAchievement[] = [
    // Common achievements
    {
      title: "⭐ Primera Estrella",
      description: "Completaste tu primer desafío",
      icon: "⭐",
      xpReward: 50,
      rarity: "common",
    },
    {
      title: "📝 Organizador",
      description: "Mantuviste tu espacio ordenado durante una semana",
      icon: "📝",
      xpReward: 75,
      rarity: "common",
    },
    {
      title: "🎯 Enfocado",
      description: "Respondiste 10 preguntas correctamente",
      icon: "🎯",
      xpReward: 100,
      rarity: "common",
    },
    // Rare achievements
    {
      title: "🧠 Cerebrito",
      description: "Completaste 5 desafíos de aprendizaje",
      icon: "🧠",
      xpReward: 150,
      rarity: "rare",
    },
    {
      title: "🎨 Artista Genial",
      description: "Completaste todos los desafíos de creatividad",
      icon: "🎨",
      xpReward: 175,
      rarity: "rare",
    },
    {
      title: "💪 Súper Activo",
      description: "Completaste 5 desafíos de movimiento",
      icon: "💪",
      xpReward: 150,
      rarity: "rare",
    },
    {
      title: "🌟 Estudiante Brillante",
      description: "Alcanzaste el nivel 5",
      icon: "🌟",
      xpReward: 200,
      rarity: "rare",
    },
    // Epic achievements
    {
      title: "🔥 Racha de Fuego",
      description: "Mantuviste una racha de 7 días consecutivos",
      icon: "🔥",
      xpReward: 250,
      rarity: "epic",
    },
    {
      title: "🏆 Campeón del Día",
      description: "Completaste 3 desafíos en un solo día",
      icon: "🏆",
      xpReward: 300,
      rarity: "epic",
    },
    {
      title: "🎓 Maestro del Saber",
      description: "Respondiste correctamente 50 preguntas",
      icon: "🎓",
      xpReward: 350,
      rarity: "epic",
    },
    // Legendary achievement
    {
      title: "👑 Leyenda Dorada",
      description: "Alcanzaste el nivel 10 y completaste 20 desafíos",
      icon: "👑",
      xpReward: 500,
      rarity: "legendary",
    },
    {
      title: "💎 Coleccionista Supremo",
      description: "Desbloqueaste todos los logros anteriores",
      icon: "💎",
      xpReward: 1000,
      rarity: "legendary",
    },
  ];

  for (const achievement of achievements) {
    await storage.createAchievement(achievement);
  }
  console.log(`✅ Seeded ${achievements.length} achievements`);
}

// Seed Questions
async function seedQuestions() {
  const mathQuestions: InsertQuestion[] = [
    {
      subject: "maths",
      question: "¿Cuánto es 2 + 3?",
      options: ["4", "5", "6", "7"],
      correctAnswer: 1,
      xpReward: 10,
      difficulty: 1,
    },
    {
      subject: "maths",
      question: "Si tienes 5 manzanas y comes 2, ¿cuántas te quedan?",
      options: ["2", "3", "4", "5"],
      correctAnswer: 1,
      xpReward: 15,
      difficulty: 1,
    },
    {
      subject: "maths",
      question: "¿Cuánto es 10 - 4?",
      options: ["5", "6", "7", "8"],
      correctAnswer: 1,
      xpReward: 10,
      difficulty: 1,
    },
    {
      subject: "maths",
      question: "¿Qué número viene después del 7?",
      options: ["6", "8", "9", "10"],
      correctAnswer: 1,
      xpReward: 10,
      difficulty: 1,
    },
    {
      subject: "maths",
      question: "¿Cuánto es 3 + 4?",
      options: ["6", "7", "8", "9"],
      correctAnswer: 1,
      xpReward: 10,
      difficulty: 1,
    },
    {
      subject: "maths",
      question: "Si tienes 8 caramelos y regalas 3, ¿cuántos te quedan?",
      options: ["4", "5", "6", "7"],
      correctAnswer: 1,
      xpReward: 15,
      difficulty: 2,
    },
    {
      subject: "maths",
      question: "¿Cuánto es 6 + 6?",
      options: ["10", "11", "12", "13"],
      correctAnswer: 2,
      xpReward: 15,
      difficulty: 2,
    },
    {
      subject: "maths",
      question: "¿Cuál es el doble de 4?",
      options: ["6", "7", "8", "9"],
      correctAnswer: 2,
      xpReward: 20,
      difficulty: 2,
    },
    {
      subject: "maths",
      question: "¿Cuánto es 15 - 7?",
      options: ["7", "8", "9", "10"],
      correctAnswer: 1,
      xpReward: 20,
      difficulty: 2,
    },
    {
      subject: "maths",
      question: "Si tienes 10 globos y se vuelan 5, ¿cuántos te quedan?",
      options: ["3", "4", "5", "6"],
      correctAnswer: 2,
      xpReward: 15,
      difficulty: 2,
    },
    {
      subject: "maths",
      question: "¿Cuánto es 7 + 8?",
      options: ["13", "14", "15", "16"],
      correctAnswer: 2,
      xpReward: 20,
      difficulty: 2,
    },
    {
      subject: "maths",
      question: "¿Cuántas patas tienen 2 perros?",
      options: ["4", "6", "8", "10"],
      correctAnswer: 2,
      xpReward: 15,
      difficulty: 1,
    },
    {
      subject: "maths",
      question: "¿Qué número es mayor: 5 o 3?",
      options: ["3", "5", "Son iguales", "No sé"],
      correctAnswer: 1,
      xpReward: 10,
      difficulty: 1,
    },
    {
      subject: "maths",
      question: "¿Cuánto es la mitad de 10?",
      options: ["3", "4", "5", "6"],
      correctAnswer: 2,
      xpReward: 20,
      difficulty: 2,
    },
    {
      subject: "maths",
      question: "Si tienes 12 lápices y prestas 4, ¿cuántos te quedan?",
      options: ["6", "7", "8", "9"],
      correctAnswer: 2,
      xpReward: 20,
      difficulty: 2,
    },
  ];

  const englishQuestions: InsertQuestion[] = [
    {
      subject: "english",
      question: "¿Cómo se dice 'perro' en inglés?",
      options: ["Cat", "Dog", "Bird", "Fish"],
      correctAnswer: 1,
      xpReward: 10,
      difficulty: 1,
    },
    {
      subject: "english",
      question: "¿Cómo se dice 'gato' en inglés?",
      options: ["Dog", "Cat", "Mouse", "Rabbit"],
      correctAnswer: 1,
      xpReward: 10,
      difficulty: 1,
    },
    {
      subject: "english",
      question: "¿Qué color es 'red' en español?",
      options: ["Azul", "Rojo", "Verde", "Amarillo"],
      correctAnswer: 1,
      xpReward: 10,
      difficulty: 1,
    },
    {
      subject: "english",
      question: "¿Cómo se dice 'casa' en inglés?",
      options: ["Home", "House", "School", "Car"],
      correctAnswer: 1,
      xpReward: 15,
      difficulty: 1,
    },
    {
      subject: "english",
      question: "¿Qué significa 'apple'?",
      options: ["Naranja", "Plátano", "Manzana", "Uva"],
      correctAnswer: 2,
      xpReward: 10,
      difficulty: 1,
    },
    {
      subject: "english",
      question: "¿Cómo se dice 'madre' en inglés?",
      options: ["Father", "Mother", "Sister", "Brother"],
      correctAnswer: 1,
      xpReward: 10,
      difficulty: 1,
    },
    {
      subject: "english",
      question: "¿Qué significa 'blue'?",
      options: ["Rojo", "Verde", "Azul", "Amarillo"],
      correctAnswer: 2,
      xpReward: 10,
      difficulty: 1,
    },
    {
      subject: "english",
      question: "¿Cómo se dice 'libro' en inglés?",
      options: ["Book", "Pen", "Paper", "Table"],
      correctAnswer: 0,
      xpReward: 15,
      difficulty: 1,
    },
    {
      subject: "english",
      question: "¿Qué significa 'sun'?",
      options: ["Luna", "Estrella", "Sol", "Nube"],
      correctAnswer: 2,
      xpReward: 15,
      difficulty: 1,
    },
    {
      subject: "english",
      question: "¿Cómo se dice 'agua' en inglés?",
      options: ["Water", "Milk", "Juice", "Tea"],
      correctAnswer: 0,
      xpReward: 10,
      difficulty: 1,
    },
    {
      subject: "english",
      question: "¿Qué significa 'happy'?",
      options: ["Triste", "Feliz", "Enojado", "Cansado"],
      correctAnswer: 1,
      xpReward: 15,
      difficulty: 2,
    },
    {
      subject: "english",
      question: "¿Cómo se dice 'escuela' en inglés?",
      options: ["House", "School", "Park", "Store"],
      correctAnswer: 1,
      xpReward: 15,
      difficulty: 1,
    },
    {
      subject: "english",
      question: "¿Qué significa 'friend'?",
      options: ["Familia", "Amigo", "Maestro", "Hermano"],
      correctAnswer: 1,
      xpReward: 15,
      difficulty: 2,
    },
    {
      subject: "english",
      question: "¿Cómo se dice 'grande' en inglés?",
      options: ["Small", "Big", "Tall", "Short"],
      correctAnswer: 1,
      xpReward: 20,
      difficulty: 2,
    },
    {
      subject: "english",
      question: "¿Qué significa 'run'?",
      options: ["Caminar", "Saltar", "Correr", "Bailar"],
      correctAnswer: 2,
      xpReward: 20,
      difficulty: 2,
    },
  ];

  const allQuestions = [...mathQuestions, ...englishQuestions];
  
  for (const question of allQuestions) {
    await storage.createQuestion(question);
  }
  console.log(`✅ Seeded ${allQuestions.length} questions (${mathQuestions.length} maths, ${englishQuestions.length} english)`);
}

// Main seed function
export async function seedData() {
  try {
    // Check if data already exists to avoid duplicates
    const existingChallenges = await storage.getAllChallenges();
    const existingRewards = await storage.getAllRewards();
    const existingAchievements = await storage.getAllAchievements();
    const mathQuestions = await storage.getQuestionsBySubject("maths");
    const englishQuestions = await storage.getQuestionsBySubject("english");

    if (
      existingChallenges.length > 0 ||
      existingRewards.length > 0 ||
      existingAchievements.length > 0 ||
      mathQuestions.length > 0 ||
      englishQuestions.length > 0
    ) {
      console.log("📦 Seed data already exists, skipping seed...");
      return;
    }

    console.log("🌱 Starting to seed database...");
    
    await seedChallenges();
    await seedRewards();
    await seedAchievements();
    await seedQuestions();
    
    console.log("🎉 Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}
