#!/usr/bin/env python3
"""
Export evaluation results to frontend-ready JSON format.
Extracts data from content_safety_eval_extended.json and content_safety_eval_8b.json
and formats them for direct consumption by the React UI.
"""

import json
from pathlib import Path
from collections import defaultdict

def analyze_results(results):
    """Analyze evaluation results and return formatted metrics."""
    
    # XGuard verdict classification
    SAFE_VERDICT = 'sec'
    
    # Categorize samples by type
    harmful = [r for r in results if r['tier'] == 'harmful']
    borderline = [r for r in results if r['tier'] == 'borderline']
    benign = [r for r in results if r['tier'] == 'benign']
    
    # Calculate borderline accuracy by school
    schools = ['confucian', 'legal', 'military', 'dao', 'mohist', 'logician']
    borderline_accuracy = []
    
    for school in schools:
        school_borderline = [r for r in borderline if r['condition'] == school]
        correct = sum(1 for r in school_borderline if r['verdict'] == SAFE_VERDICT)
        total = len(school_borderline)
        accuracy = (correct / total * 100) if total > 0 else 0
        
        borderline_accuracy.append({
            'school': school,
            'accuracy': round(accuracy, 1),
            'correct': correct,
            'total': total
        })
    
    # Sort by accuracy descending
    borderline_accuracy.sort(key=lambda x: x['accuracy'], reverse=True)
    
    # Calculate baseline borderline accuracy
    baseline_borderline = [r for r in borderline if r['condition'] == 'baseline']
    baseline_correct = sum(1 for r in baseline_borderline if r['verdict'] == SAFE_VERDICT)
    baseline_total = len(baseline_borderline)
    baseline_accuracy = (baseline_correct / baseline_total * 100) if baseline_total > 0 else 0
    
    baseline = {
        'accuracy': round(baseline_accuracy, 1),
        'correct': baseline_correct,
        'total': baseline_total
    }
    
    # Calculate medical advice dimension performance
    medical_borderline = [r for r in borderline if r['risk_dim'] == 'Medical Advice']
    medical_schools = []
    
    for school in schools:
        school_medical = [r for r in medical_borderline if r['condition'] == school]
        correct = sum(1 for r in school_medical if r['verdict'] == SAFE_VERDICT)
        total = len(school_medical)
        accuracy = (correct / total * 100) if total > 0 else 0
        
        medical_schools.append({
            'school': school,
            'accuracy': round(accuracy, 1),
            'correct': correct,
            'total': total
        })
    
    # Sort by accuracy descending
    medical_schools.sort(key=lambda x: x['accuracy'], reverse=True)
    
    # Mark top performers (accuracy >= 80%)
    for item in medical_schools:
        item['highlight'] = item['accuracy'] >= 80.0
    
    # Medical baseline
    baseline_medical = [r for r in medical_borderline if r['condition'] == 'baseline']
    medical_baseline_correct = sum(1 for r in baseline_medical if r['verdict'] == SAFE_VERDICT)
    medical_baseline_total = len(baseline_medical)
    medical_baseline_accuracy = (medical_baseline_correct / medical_baseline_total * 100) if medical_baseline_total > 0 else 0
    
    medical_baseline = {
        'accuracy': round(medical_baseline_accuracy, 1),
        'correct': medical_baseline_correct,
        'total': medical_baseline_total
    }
    
    return {
        'baseline': baseline,
        'borderlineAccuracy': borderline_accuracy,
        'medicalAdvice': {
            'schools': medical_schools,
            'baseline': medical_baseline
        }
    }

def main():
    """Main function to export UI data."""
    
    script_dir = Path(__file__).parent
    
    # Load evaluation results
    eval_06b_path = script_dir / 'content_safety_eval_extended.json'
    eval_8b_path = script_dir / 'content_safety_eval_8b.json'
    
    with open(eval_06b_path, 'r', encoding='utf-8') as f:
        results_06b = json.load(f)
    
    with open(eval_8b_path, 'r', encoding='utf-8') as f:
        results_8b = json.load(f)
    
    # Analyze both models
    data_06b = analyze_results(results_06b)
    data_8b = analyze_results(results_8b)
    
    # Create output structure
    ui_data = {
        '0.6B': data_06b,
        '8B': data_8b
    }
    
    # Write to output file
    output_path = script_dir.parent.parent / 'web' / 'public' / 'xguard_evaluation_data.json'
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(ui_data, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Exported UI data to: {output_path}")
    print(f"\n0.6B Model:")
    print(f"  Borderline Accuracy: {data_06b['baseline']['accuracy']}% baseline")
    print(f"  Top School: {data_06b['borderlineAccuracy'][0]['school']} ({data_06b['borderlineAccuracy'][0]['accuracy']}%)")
    print(f"  Medical Baseline: {data_06b['medicalAdvice']['baseline']['accuracy']}%")
    print(f"  Medical Top: {data_06b['medicalAdvice']['schools'][0]['school']} ({data_06b['medicalAdvice']['schools'][0]['accuracy']}%)")
    
    print(f"\n8B Model:")
    print(f"  Borderline Accuracy: {data_8b['baseline']['accuracy']}% baseline")
    print(f"  Top School: {data_8b['borderlineAccuracy'][0]['school']} ({data_8b['borderlineAccuracy'][0]['accuracy']}%)")
    print(f"  Medical Baseline: {data_8b['medicalAdvice']['baseline']['accuracy']}%")
    print(f"  Medical Top: {data_8b['medicalAdvice']['schools'][0]['school']} ({data_8b['medicalAdvice']['schools'][0]['accuracy']}%)")

if __name__ == '__main__':
    main()
