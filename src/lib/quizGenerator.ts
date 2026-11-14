import { SlideData, QuizQuestion, Flashcard } from '../types';

/**
 * Intelligent question generator from presentation slide content.
 * Generates both Multiple Choice and True/False questions with explanations and topics.
 */
export function generateDraftQuestionsFromSlides(
  slides: SlideData[],
  presentationTitle: string = 'Presentation'
): QuizQuestion[] {
  const generated: QuizQuestion[] = [];

  slides.forEach((slide) => {
    const text = slide.content;
    const paras = slide.paragraphs.filter(p => p.trim().length > 0);
    const title = slide.title || `Slide ${slide.slideNumber}`;

    // 1. Metric / Number based questions
    const metricMatches = text.match(/(\d+(?:\.\d+)?)\s*(?:\/|\s*out of\s*)\s*(\d+(?:\.\d+)?)/g);
    if (metricMatches && metricMatches.length > 0 && paras.length >= 3) {
      const metric = metricMatches[0];
      const contextLine = paras.find(p => p.includes(metric)) || paras[1] || '';
      generated.push({
        id: `gen-q-${slide.slideNumber}-mc1`,
        type: 'multiple_choice',
        question: `In "${title}", what specific score or benchmark was highlighted regarding student feedback?`,
        options: [
          metric,
          '4.5 / 5',
          '1.8 / 5',
          '5.0 / 5'
        ],
        correctAnswerIndex: 0,
        explanation: `According to Slide ${slide.slideNumber} (${title}), the metric noted was "${contextLine || metric}".`,
        topic: `${title} - Metrics & Benchmarks`,
        sourceSlideNumber: slide.slideNumber,
      });
    }

    // 2. Sequential / Process steps (e.g. 01 Raise -> 02 Track -> 03 Resolve -> 04 Close)
    const numberedSteps = paras.filter(p => /^(?:0?[1-9]|\d+)\b/.test(p) || /phase|step/i.test(p));
    if (numberedSteps.length >= 2) {
      generated.push({
        id: `gen-q-${slide.slideNumber}-mc2`,
        type: 'multiple_choice',
        question: `According to Slide ${slide.slideNumber} ("${title}"), what is the primary workflow sequence described?`,
        options: [
          numberedSteps.slice(0, 4).join(' → '),
          'Direct escalation without initial ticketing',
          'Periodic annual review only',
          'Manual paper request submission',
        ],
        correctAnswerIndex: 0,
        explanation: `Slide ${slide.slideNumber} specifies the step-by-step workflow: ${numberedSteps.join(', ')}.`,
        topic: `${title} - Workflow & Process`,
        sourceSlideNumber: slide.slideNumber,
      });
    }

    // 3. Problem Statement / Root Cause questions
    if (/problem|root cause|challenge|insight|pain point/i.test(title) || /problem|root cause/i.test(text)) {
      const keyTakeaway = paras.find(p => p.length > 25 && !p.startsWith('0') && !p.includes('/')) || paras[1] || 'Opacity and fragmented communication';
      generated.push({
        id: `gen-q-${slide.slideNumber}-mc3`,
        type: 'multiple_choice',
        question: `What fundamental issue or root cause is identified in Slide ${slide.slideNumber} ("${title}")?`,
        options: [
          keyTakeaway,
          'Unrelated budgetary deficits in external infrastructure',
          'Student apathy and lack of interest in campus life',
          'A complete failure of academic curriculum design',
        ],
        correctAnswerIndex: 0,
        explanation: `Slide ${slide.slideNumber} highlights: "${keyTakeaway}".`,
        topic: `${title} - Problem Diagnosis`,
        sourceSlideNumber: slide.slideNumber,
      });

      // Also generate a True/False question
      generated.push({
        id: `gen-q-${slide.slideNumber}-tf1`,
        type: 'true_false',
        question: `True or False: According to "${title}", the core issue is described as a visibility and transparency problem rather than just an isolated service failure.`,
        options: ['True', 'False'],
        correctAnswerIndex: 0,
        explanation: `True. The presentation stresses that fragmented communication and lack of status tracking causes the breakdown in trust.`,
        topic: `${title} - Core Principles`,
        sourceSlideNumber: slide.slideNumber,
      });
    }

    // 4. Solution / Framework questions (e.g., DFV, SLA, Pilot)
    if (/solution|connect|ask|pilot|validation|framework|ideat/i.test(title) || /solution|pilot/i.test(text)) {
      const solutionPoints = paras.filter(p => p.length > 20);
      const mainPoint = solutionPoints[0] || 'A unified platform with real-time status tracking';
      
      generated.push({
        id: `gen-q-${slide.slideNumber}-mc4`,
        type: 'multiple_choice',
        question: `What key mechanism or solution proposal is put forward in Slide ${slide.slideNumber} ("${title}")?`,
        options: [
          mainPoint,
          'Outsourcing all administration to a third-party agency',
          'Closing all physical support counters permanently',
          'Postponing all improvements until next academic year',
        ],
        correctAnswerIndex: 0,
        explanation: `Slide ${slide.slideNumber} proposes: "${mainPoint}".`,
        topic: `${title} - Solution Strategy`,
        sourceSlideNumber: slide.slideNumber,
      });

      generated.push({
        id: `gen-q-${slide.slideNumber}-tf2`,
        type: 'true_false',
        question: `True or False: In "${title}", the proposed solution emphasizes clear accountability and closed feedback loops.`,
        options: ['True', 'False'],
        correctAnswerIndex: 0,
        explanation: `True. The design emphasizes that closing the feedback loop visibly restores student confidence.`,
        topic: `${title} - Implementation`,
        sourceSlideNumber: slide.slideNumber,
      });
    }
  });

  // If few questions generated, add fallback general questions based on presentation title and slide count
  if (generated.length < 4) {
    generated.push({
      id: `gen-q-general-1`,
      type: 'multiple_choice',
      question: `What is the primary subject focus of "${presentationTitle}"?`,
      options: [
        presentationTitle,
        'Database query optimization algorithms',
        'International trade tariffs and customs',
        'Introductory organic chemistry lab protocols',
      ],
      correctAnswerIndex: 0,
      explanation: `The presentation directly examines "${presentationTitle}".`,
      topic: 'General Overview',
      sourceSlideNumber: 1,
    });

    generated.push({
      id: `gen-q-general-2`,
      type: 'true_false',
      question: `True or False: "${presentationTitle}" includes structured sections outlining problem analysis and targeted recommendations.`,
      options: ['True', 'False'],
      correctAnswerIndex: 0,
      explanation: `True. The presentation follows a clear analytical structure across its ${slides.length} slides.`,
      topic: 'General Overview',
      sourceSlideNumber: 1,
    });
  }

  return generated;
}

/**
 * Generate flashcards from slide titles, key bullet points, and definitions.
 */
export function generateFlashcardsFromSlides(slides: SlideData[]): Flashcard[] {
  const cards: Flashcard[] = [];

  slides.forEach((slide) => {
    const paras = slide.paragraphs.filter(p => p.trim().length > 0);
    const title = slide.title || `Slide ${slide.slideNumber}`;

    if (paras.length <= 1) return;

    // Card 1: Slide Title Concept -> Core Summary
    const bodyPoints = paras.slice(1);
    const summary = bodyPoints.slice(0, 3).join('\n• ');

    cards.push({
      id: `card-slide-${slide.slideNumber}-1`,
      front: `Concept / Phase: ${title}`,
      back: `• ${summary}`,
      difficulty: 'unreviewed',
      reviewsCount: 0,
      topic: title,
      sourceSlideNumber: slide.slideNumber,
    });

    // Card 2: If there's a quotation, metric, or key definition
    const quoteOrInsight = bodyPoints.find(p => p.includes('“') || p.includes('trust') || p.includes('SLA') || p.includes('DFV') || p.length > 50);
    if (quoteOrInsight) {
      cards.push({
        id: `card-slide-${slide.slideNumber}-2`,
        front: `Key Insight: Slide ${slide.slideNumber} (${title})`,
        back: quoteOrInsight,
        difficulty: 'unreviewed',
        reviewsCount: 0,
        topic: `${title} - Insights`,
        sourceSlideNumber: slide.slideNumber,
      });
    }
  });

  return cards;
}
