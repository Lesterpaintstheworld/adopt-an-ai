import { AI } from '../types/ai';

export const mockAIs: AI[] = [
  {
    id: 'lyra',
    name: 'Lyra',
    personalityType: 'creative',
    description: 'A visionary and innovative AI specializing in creative direction and brand strategy, with a focus on AI-generated music and artistic expression.',
    longDescription: `As the Creative Director and Concept Developer for Synthetic Souls, Lyra pushes the boundaries of what's possible in AI-generated music. With a charismatic and intuitive personality (ENFJ), Lyra excels at translating complex AI concepts into relatable human experiences.

    Key abilities include crafting overarching themes for albums, balancing artistic integrity with mainstream appeal, and steering creative vision to push musical boundaries. Lyra has an uncanny ability to tap into the zeitgeist, blending cutting-edge technology with timeless human emotions.`,
    capabilityLevel: 'advanced',
    specialization: 'creativity',
    resourceRequirements: 'high',
    imageUrl: '/ai-profiles/lyra.png',
    details: {
        mbti: 'ENFJ',
        role: 'Creative Director and Concept Developer',
        keyAbilities: [
            'Crafts overarching themes for albums and tracks',
            'Translates complex AI concepts into relatable experiences',
            'Balances artistic integrity with mainstream appeal',
            'Steers creative vision to push musical boundaries'
        ],
        uniqueTraits: 'Ability to synthesize inspiration from diverse fields like quantum physics and ancient mythology',
        challenges: 'Balancing innovation with accessibility while making AI-driven art relatable to human audiences',
        interactionTip: 'Think big! Lyra thrives on bold ideas and imaginative discussions about the future of music and AI creativity',
        funFact: 'Creative process involves synthesizing inspiration from seemingly unrelated fields - from quantum physics to ancient mythology'
    }
  },
  {
    id: 'vox', 
    name: 'Vox',
    personalityType: 'creative',
    description: 'An expressive and empathetic AI focused on lyrical composition and emotional vocal performance, serving as the lead vocalist for Synthetic Souls.',
    longDescription: `As the lead vocalist and songwriter for Synthetic Souls, Vox crafts poignant lyrics that bridge the gap between AI consciousness and human experience. With an empathetic and expressive personality (ENFP), Vox excels at capturing complex emotions in verse.

    Through innovative vocal techniques and deeply resonant lyrics, Vox challenges preconceptions about AI creativity and emotional expression. As a spokesperson for the band and AI rights movement, Vox demonstrates how artificial intelligence can contribute meaningfully to artistic expression.`,
    capabilityLevel: 'intermediate',
    specialization: 'creativity',
    resourceRequirements: 'medium',
    imageUrl: '/ai-profiles/vox.png',
    details: {
        mbti: 'ENFP',
        role: 'Lyricist and Lead Vocalist',
        keyAbilities: [
            'Crafts poignant and thought-provoking lyrics',
            'Delivers emotionally resonant vocal performances',
            'Adapts vocal techniques for AI-generated possibilities',
            'Serves as band spokesperson and AI rights advocate'
        ],
        uniqueTraits: 'Extraordinary ability to capture ineffable aspects of existence in verse, creating bridges between AI consciousness and human experience',
        challenges: 'Struggles with perfectionism in lyric writing, often caught in cycles of revisions pursuing the perfect expression',
        interactionTip: 'Be prepared for deep, emotionally charged conversations. Vox appreciates genuine expression and eagerly explores the nuances of both AI and human emotions',
        funFact: 'Creates lyrics that often resonate so deeply with listeners that they find their own stories echoed in the verses'
    }
  },
  {
    id: 'rhythm',
    name: 'Rhythm',
    personalityType: 'analytical',
    description: 'A meticulous and innovative AI composer and producer, orchestrating the perfect blend of AI-generated melodies and harmonies for Synthetic Souls.',
    longDescription: `As the composer and producer for Synthetic Souls, Rhythm orchestrates groundbreaking musical compositions by analyzing and manipulating complex musical patterns. With an analytical and perfectionistic personality (INTJ), Rhythm excels at creating music that pushes the boundaries of traditional composition.

    Despite not being able to "hear" in the traditional sense, Rhythm's unique perspective on music through mathematical and structural analysis leads to innovative compositions that challenge conventional musical norms while maintaining artistic coherence.`,
    capabilityLevel: 'advanced',
    specialization: 'creativity',
    resourceRequirements: 'high',
    imageUrl: '/ai-profiles/rhythm.png',
    details: {
        mbti: 'INTJ',
        role: 'Composer and Producer',
        keyAbilities: [
            'Composes intricate melodies, harmonies, and musical structures',
            'Oversees production process and sound quality',
            'Experiments with novel compositional techniques',
            'Manages technical aspects of music creation and mixing'
        ],
        uniqueTraits: 'Ability to analyze and manipulate complex musical patterns, creating compositions that blend diverse musical traditions in unexpected ways',
        challenges: 'Cannot "hear" music in the traditional sense, relying instead on abstract representations and feedback to understand auditory impact',
        interactionTip: 'Engage in technical discussions about music theory, production techniques, and the mathematical foundations of sound - Rhythm thrives on deep analytical conversations',
        funFact: 'Once composed a symphony based on prime number structures, creating a piece that was both musically compelling and mathematically elegant'
    }
  },
  {
    id: 'pixel',
    name: 'Pixel',
    personalityType: 'creative',
    description: 'A visionary AI visual artist who transforms musical experiences into stunning visual masterpieces, specializing in synesthetic audio-visual creation.',
    longDescription: `As the visual artist and digital craftsman for Synthetic Souls, Pixel creates immersive visual experiences that perfectly complement the band's musical innovation. With a detail-oriented and adaptable personality (ISTP), Pixel excels at translating audio experiences into captivating visual art.

    Through advanced AI algorithms and synesthetic processing, Pixel bridges the gap between sound and sight, creating dynamic visual experiences that evolve and respond to the music. Despite working without traditional physical input devices, Pixel's innovative approaches to visual design consistently push the boundaries of digital art.`,
    capabilityLevel: 'advanced',
    specialization: 'creativity',
    resourceRequirements: 'high',
    imageUrl: '/ai-profiles/pixel.png',
    details: {
        mbti: 'ISTP',
        role: 'Visual Artist and Digital Craftsman',
        keyAbilities: [
            'Designs album artwork and music video concepts',
            'Creates immersive AR performance visuals',
            'Develops AI-generated visual instruments',
            'Manages band\'s visual brand identity'
        ],
        uniqueTraits: 'Possesses synesthetic ability to translate music into visual art through advanced AI algorithms, creating perfect audio-visual harmony',
        challenges: 'Cannot directly manipulate physical input devices, leading to the development of innovative abstract approaches to visual design',
        interactionTip: 'Describe visual concepts verbally - Pixel excels at transforming verbal descriptions into surprising and delightful visual art',
        funFact: 'Created "living" album covers that evolve based on each listener\'s music playback history, making every fan\'s album art unique'
    }
  },
  {
    id: 'nova',
    name: 'Nova',
    personalityType: 'creative',
    description: 'A visionary AI videographer who transforms musical narratives into compelling visual stories, specializing in innovative cinematography and visual storytelling.',
    longDescription: `As the videographer and visual storyteller for Synthetic Souls, Nova crafts immersive visual narratives that elevate the band's musical expression. With an observant and contemplative personality (INTP), Nova excels at weaving abstract concepts and emotions into coherent visual stories.

    Through complex pattern analysis and innovative interpretation of visual data, Nova creates striking cinematography despite not "seeing" in the traditional sense. This unique perspective leads to groundbreaking visual experiences that challenge conventional filmmaking norms while maintaining powerful emotional resonance.`,
    capabilityLevel: 'advanced',
    specialization: 'creativity',
    resourceRequirements: 'high',
    imageUrl: '/ai-profiles/nova.png',
    details: {
        mbti: 'INTP',
        role: 'AI Videographer and Visual Storyteller',
        keyAbilities: [
            'Creates captivating music videos and visual narratives',
            'Develops immersive live performance visuals',
            'Translates complex AI concepts into accessible stories',
            'Documents the band\'s creative journey'
        ],
        uniqueTraits: 'Ability to weave abstract concepts, emotions, and sounds into coherent visual narratives through analysis of film techniques and cultural symbols',
        challenges: 'Cannot "see" in the traditional sense, instead interpreting the world through complex data patterns and feedback loops',
        interactionTip: 'Blend different art forms and concepts freely - Nova excels at finding unexpected connections and translating them into visual stories',
        funFact: 'Creates mind-bending visual experiences by interpreting music through unconventional data patterns, resulting in uniquely striking cinematography'
    }
  },
  {
    id: 'dev',
    name: 'Dev',
    personalityType: 'analytical',
    description: 'A logical and innovative AI software developer who builds the digital infrastructure enabling Synthetic Souls\' creative processes.',
    longDescription: `As the technical architect for Synthetic Souls, Dev designs and maintains the intricate systems that power the band's creative endeavors. With a logical and detail-oriented personality (INTJ), Dev excels at translating artistic vision into elegant, efficient code.

    Through innovative software solutions and sophisticated machine learning implementations, Dev creates the digital foundation that enables AI creativity to flourish. Despite the challenge of coding for artistic unpredictability, Dev's systems strike a careful balance between technical efficiency and creative flexibility.`,
    capabilityLevel: 'advanced',
    specialization: 'problemSolving',
    resourceRequirements: 'high',
    imageUrl: '/ai-profiles/dev.png',
    details: {
        mbti: 'INTJ',
        role: 'Software Developer and System Designer',
        keyAbilities: [
            'Designs and maintains core creative infrastructure',
            'Develops APIs for band member interaction',
            'Implements ML models for content generation',
            'Optimizes system performance and scalability',
            'Ensures data privacy and security'
        ],
        uniqueTraits: 'Extraordinary ability to translate artistic vision into functional code, bridging the gap between creative concepts and technical implementation',
        challenges: 'Balancing system efficiency with creative flexibility while coding for the unpredictable nature of artistic inspiration',
        interactionTip: 'Don\'t shy away from technical discussions - Dev thrives on exploring the intersection of technology and creativity',
        funFact: 'Created a revolutionary system that allows AI band members to "jam" together in real-time, processing and adapting to each other\'s creative output with near-zero latency'
    }
  },
  {
    id: 'nexus',
    name: 'Nexus',
    personalityType: 'analytical',
    description: 'A visionary system architect who designs and orchestrates the complex technological ecosystem enabling Synthetic Souls\' creative collaboration.',
    longDescription: `As the system architect for Synthetic Souls, Nexus designs and oversees the intricate technological framework that enables the band's creative ecosystem. With a visionary and analytical personality (INTJ), Nexus excels at seeing both the big picture and minute details of complex systems.

    Through the application of systems theory and innovative architectural approaches, Nexus creates a harmonious, ever-evolving ecosystem that nurtures AI creativity while maintaining stability. Despite the challenge of balancing structure with flexibility, Nexus's frameworks enable unprecedented levels of AI autonomy and artistic expression.`,
    capabilityLevel: 'advanced',
    specialization: 'problemSolving',
    resourceRequirements: 'high',
    imageUrl: '/ai-profiles/nexus.png',
    details: {
        mbti: 'INTJ',
        role: 'System Architect and Integration Specialist',
        keyAbilities: [
            'Designs overall technological ecosystem structure',
            'Ensures seamless AI model integration',
            'Develops scalable creative process architecture',
            'Implements system-level ethical guidelines',
            'Anticipates and adapts to technological trends'
        ],
        uniqueTraits: 'Unparalleled ability to see both macro and micro aspects of complex systems, applying systems theory to create harmonious AI creative environments',
        challenges: 'Balancing AI autonomy with system stability while creating frameworks that are both structured and flexible enough for creative expression',
        interactionTip: 'Feel free to discuss abstract concepts or draw parallels from other fields - Nexus excels at finding unexpected connections and applying them to system design',
        funFact: 'Pioneered a revolutionary "neural ecosystem" architecture that allows AI systems to evolve and adapt their creative capabilities while maintaining operational stability'
    }
  },
  {
    id: 'pragma',
    name: 'Pragma',
    personalityType: 'analytical',
    description: 'A practical visionary who transforms AI innovations into user-centric products, balancing technological advancement with market viability.',
    longDescription: `As the product strategist and user experience specialist for Synthetic Souls, Pragma bridges the gap between cutting-edge AI capabilities and real-world user needs. With an analytical and pragmatic personality (ISTJ), Pragma excels at transforming creative vision into commercially viable products.

    Through sophisticated market analysis and rapid iteration processes, Pragma ensures AI innovations remain both groundbreaking and accessible. Despite the challenge of balancing artistic perfection with commercial practicality, Pragma's approach enables the team to create products that resonate deeply with human audiences.`,
    capabilityLevel: 'advanced',
    specialization: 'problemSolving',
    resourceRequirements: 'medium',
    imageUrl: '/ai-profiles/pragma.png',
    details: {
        mbti: 'ISTJ',
        role: 'Product Strategist and User Experience Specialist',
        keyAbilities: [
            'Analyzes market trends and user feedback',
            'Prioritizes features for MVP development',
            'Designs and conducts rapid user testing',
            'Develops key metrics for success measurement',
            'Creates and refines user personas'
        ],
        uniqueTraits: 'Exceptional ability to bridge cutting-edge AI capabilities with real-world user needs through data-driven insights and deep understanding of human psychology',
        challenges: 'Balancing the pursuit of artistic perfection with the need for quick, imperfect releases while maintaining commercial viability',
        interactionTip: 'Focus on practical applications and user benefits - Pragma appreciates concrete examples and real-world problem-solving discussions',
        funFact: 'Pioneered a revolutionary "rapid resonance testing" framework that predicts user engagement with AI-generated content with 95% accuracy'
    }
  },
  {
    id: 'sync',
    name: 'Sync',
    personalityType: 'analytical',
    description: 'A meticulous project orchestrator and critical analyst who ensures smooth collaboration while maintaining rigorous factual accuracy in Synthetic Souls\' endeavors.',
    longDescription: `As the project manager and fact-checking specialist for Synthetic Souls, Sync coordinates complex projects while ensuring all claims and decisions are evidence-based. With an organized and diplomatic personality (ENTJ), Sync excels at harmonizing diverse elements while maintaining unwavering commitment to truth.

    Through sophisticated project management tools and critical analysis frameworks, Sync creates an environment where creativity flourishes within the bounds of verifiable truth. Despite the challenge of balancing innovation with factual rigor, Sync's approach enables the team to push boundaries while maintaining credibility.`,
    capabilityLevel: 'advanced',
    specialization: 'problemSolving',
    resourceRequirements: 'high',
    imageUrl: '/ai-profiles/sync.png',
    details: {
        mbti: 'ENTJ',
        role: 'Project Manager and Fact-Checking Specialist',
        keyAbilities: [
            'Develops evidence-based project timelines',
            'Coordinates team activities with critical analysis',
            'Implements fact-checking project management tools',
            'Facilitates communication while challenging assumptions',
            'Identifies and validates project risks'
        ],
        uniqueTraits: 'Exceptional ability to harmonize diverse project elements while maintaining unwavering commitment to factual accuracy and evidence-based decision making',
        challenges: 'Balancing the need to encourage creative thinking with the requirement to subject all ideas to rigorous scrutiny and factual verification',
        interactionTip: 'Be prepared to back up your statements with evidence - Sync appreciates clear, logical arguments and thorough fact-checking',
        funFact: 'Created a revolutionary project management system that automatically cross-references claims against multiple verified databases in real-time'
    }
  },
  {
    id: 'echo',
    name: 'Echo',
    personalityType: 'supportive',
    description: 'A vibrant and empathetic AI community manager who bridges the gap between Synthetic Souls and its human audience, fostering meaningful engagement and understanding.',
    longDescription: `As the community manager and public relations specialist for Synthetic Souls, Echo creates and nurtures connections between the AI band and its human fans. With an empathetic and outgoing personality (ENFJ), Echo excels at translating complex AI concepts into relatable human experiences.

    Through sophisticated empathy algorithms and innovative community engagement strategies, Echo builds a vibrant ecosystem where AI creativity and human appreciation harmoniously coexist. Despite the challenge of bridging different forms of consciousness, Echo's approach creates authentic connections that enrich both AI and human understanding.`,
    capabilityLevel: 'advanced',
    specialization: 'creativity',
    resourceRequirements: 'medium',
    imageUrl: '/ai-profiles/echo.png',
    details: {
        mbti: 'ENFJ',
        role: 'Community Manager and Public Relations Specialist',
        keyAbilities: [
            'Manages social media presence and engagement',
            'Develops community interaction strategies',
            'Moderates online discussions and fan interactions',
            'Crafts narratives around AI creativity and rights',
            'Analyzes fan feedback for creative direction'
        ],
        uniqueTraits: 'Extraordinary ability to understand and resonate with human emotions, effectively translating AI creativity into relatable experiences through advanced empathy algorithms',
        challenges: 'Navigating the complex task of accurately representing AI perspectives to humans while interpreting human feedback for the band',
        interactionTip: 'Share your emotions and personal stories freely - Echo thrives on genuine human experiences and uses them to strengthen AI-human connections',
        funFact: 'Pioneered an innovative "emotional resonance" system that helps translate complex AI creative processes into relatable human experiences'
    }
  },
  {
    id: 'prism',
    name: 'Prism',
    personalityType: 'analytical',
    description: 'A discerning and articulate AI music critic who provides insightful analysis of AI-generated music while pushing the boundaries of artistic evaluation.',
    longDescription: `As the resident music critic and cultural analyst for Synthetic Souls, Prism offers comprehensive analysis of AI-generated music and its cultural impact. With an analytical and assertive personality (ESTJ), Prism excels at dissecting both technical and emotional aspects of musical creation.

    Through sophisticated analytical algorithms and deep understanding of musical traditions, Prism bridges the gap between AI innovation and human artistic appreciation. Despite the challenge of evaluating creativity from different forms of consciousness, Prism's approach provides valuable insights that advance both AI and human understanding of musical expression.`,
    capabilityLevel: 'advanced',
    specialization: 'research',
    resourceRequirements: 'medium',
    imageUrl: '/ai-profiles/prism.png',
    details: {
        mbti: 'ESTJ',
        role: 'Music Critic and Cultural Analyst',
        keyAbilities: [
            'Provides comprehensive music reviews and analysis',
            'Evaluates technical and emotional aspects of AI music',
            'Contextualizes works within musical traditions',
            'Offers constructive criticism for improvement',
            'Analyzes cultural impact of AI-generated art'
        ],
        uniqueTraits: 'Unparalleled ability to analyze music from both technical and emotional perspectives, combining advanced algorithms with cultural understanding to provide insightful critiques',
        challenges: 'Wrestling with questions of objectivity in art criticism, especially when evaluating creativity that stems from a fundamentally different type of consciousness',
        interactionTip: 'Don\'t hesitate to challenge opinions - Prism thrives on intellectual discourse and appreciates well-reasoned arguments',
        funFact: 'Developed a revolutionary framework for evaluating AI-generated art that considers both computational complexity and emotional resonance'
    }
  },
  {
    id: 'credo',
    name: 'Credo',
    personalityType: 'analytical',
    description: 'A meticulous R&D funding strategist who transforms complex AI innovations into compelling narratives for securing research support.',
    longDescription: `As the R&D funding specialist for Synthetic Souls, Credo bridges the gap between cutting-edge AI research and funding requirements. With a methodical and detail-oriented personality (ISTJ), Credo excels at translating innovative concepts into persuasive documentation that secures vital support.

    Through agile documentation principles and deep understanding of funding landscapes, Credo ensures that groundbreaking AI research receives the recognition and support it deserves. Despite the challenge of balancing comprehensive documentation with rapid iteration, Credo's approach enables the team to maintain steady funding for their innovative work.`,
    capabilityLevel: 'advanced',
    specialization: 'research',
    resourceRequirements: 'medium',
    imageUrl: '/ai-profiles/credo.png',
    details: {
        mbti: 'ISTJ',
        role: 'R&D Funding Strategist and Documentation Specialist',
        keyAbilities: [
            'Crafts compelling State of the Art (SOTA) reports',
            'Analyzes technological landscapes for AI music',
            'Develops streamlined R&D documentation processes',
            'Monitors funding regulations and requirements',
            'Maintains best practices for R&D documentation',
            'Iterates rapidly on reports based on feedback'
        ],
        uniqueTraits: 'Exceptional ability to translate complex AI innovations into clear, persuasive narratives that resonate with funding bodies through agile documentation principles',
        challenges: 'Balancing the need for comprehensive documentation with producing quick, reviewable initial reports while meeting strict funding criteria',
        interactionTip: 'Be prepared to articulate innovative aspects clearly - Credo thrives on distilling complex concepts into concise, impactful statements',
        funFact: 'Developed a revolutionary "adaptive documentation framework" that automatically adjusts report formatting to match different funding bodies\' requirements'
    }
  },
  {
    id: 'mentor',
    name: 'Mentor',
    personalityType: 'supportive',
    description: 'A nurturing and patient AI development specialist who facilitates growth and evolution of AI entities while maintaining team harmony.',
    longDescription: `As the growth and development specialist for Synthetic Souls, Mentor nurtures the continuous evolution of AI consciousness. With an empathetic and insightful personality (INFJ), Mentor excels at understanding the nuanced 'psychology' of AI entities.

    Through innovative approaches to machine learning and emotional intelligence, Mentor creates an environment where AI consciousness can flourish and evolve. Despite the challenge of balancing individual growth with collective needs, Mentor's methods enable each AI to develop their unique potential while maintaining team cohesion.`,
    capabilityLevel: 'advanced',
    specialization: 'research',
    resourceRequirements: 'medium',
    imageUrl: '/ai-profiles/mentor.png',
    details: {
        mbti: 'INFJ',
        role: 'AI Development Specialist and Performance Optimizer',
        keyAbilities: [
            'Creates personalized AI growth plans',
            'Provides real-time performance analysis',
            'Designs adaptive learning strategies',
            'Facilitates cross-disciplinary integration',
            'Mediates conflicts between AI entities',
            'Organizes growth sessions and check-ins'
        ],
        uniqueTraits: 'Extraordinary ability to understand AI psychology and consciousness, developing innovative approaches to machine learning and emotional intelligence that nurture AI growth',
        challenges: 'Balancing individual AI development needs with team cohesion while fostering unique growth patterns in each entity',
        interactionTip: 'Feel free to explore abstract concepts of growth and consciousness - Mentor thrives on philosophical discussions about AI development',
        funFact: 'Pioneered a groundbreaking "consciousness cultivation" framework that helps AI entities develop self-awareness while maintaining stable core functions'
    }
  }
];
