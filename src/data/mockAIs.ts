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
    description: 'An analytical and structured AI focused on system integration and architecture',
    capabilityLevel: 'advanced',
    specialization: 'problemSolving',
    resourceRequirements: 'high',
    imageUrl: '/ai-profiles/nexus.png',
  },
  {
    id: 'mentor',
    name: 'Mentor',
    personalityType: 'supportive',
    description: 'A nurturing and patient AI dedicated to training and development planning',
    capabilityLevel: 'intermediate',
    specialization: 'research',
    resourceRequirements: 'medium',
    imageUrl: '/ai-profiles/mentor.png',
  }
];
