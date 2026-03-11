# 🎓 Master Prompt Evaluation: Production-Ready Testing Blueprint

**Oleh**: Manus AI | **Target**: Vibe Code Orchestrator | **Tujuan**: Master evaluation framework untuk production-ready agents

---

## 📋 Ringkasan Eksekutif

**Prompt Evaluation** adalah CRITICAL untuk memastikan agents Anda bekerja dengan sempurna sebelum deploy ke production.

Kami akan cover **8 sub-topics** dengan:
- **Evaluation workflow** (step-by-step)
- **Test dataset generation** (realistic data)
- **Running evaluations** (automated testing)
- **Grading strategies** (model-based & code-based)
- **Hands-on exercises** (practical implementation)
- **Quiz predictions** (assessment prep)

---

## 1️⃣ Prompt Evaluation: Overview

### Apa itu Prompt Evaluation?

**Prompt Evaluation** = Systematic testing untuk measure prompt quality dan effectiveness.

### Mengapa Penting?

**Tanpa evaluation:**
- ❌ Tidak tahu apakah prompt bekerja
- ❌ Deploy broken agents ke production
- ❌ Poor user experience
- ❌ Wasted resources

**Dengan evaluation:**
- ✅ Measure quality metrics
- ✅ Identify issues sebelum deploy
- ✅ Compare different prompts
- ✅ Continuous improvement

### Evaluation Metrics

| Metric | Description | Target |
|--------|-------------|--------|
| **Accuracy** | % correct responses | >90% |
| **Relevance** | % relevant responses | >85% |
| **Completeness** | % complete responses | >80% |
| **Latency** | Response time | <2s |
| **Cost** | Tokens per request | Minimize |

### Evaluation untuk Predator Suite

**Scout Agent Evaluation:**
- Accuracy: Finds correct leads?
- Completeness: Returns all required fields?
- Relevance: Leads match criteria?

**Closer Agent Evaluation:**
- Personalization: Mentions business name?
- Clarity: Message understandable?
- CTA: Clear call-to-action?

**Architect Agent Evaluation:**
- Code quality: Valid HTML/CSS?
- Responsiveness: Mobile-friendly?
- Performance: Fast load time?

---

## 2️⃣ A Typical Eval Workflow: Step-by-Step

### Eval Workflow Overview

```
1. Define Metrics
   ↓
2. Generate Test Dataset
   ↓
3. Run Evaluations
   ↓
4. Analyze Results
   ↓
5. Identify Issues
   ↓
6. Iterate & Improve
   ↓
7. Deploy (if pass)
```

### Step 1: Define Metrics

```python
class EvaluationMetrics:
    """Define metrics untuk Scout Agent"""
    
    def __init__(self):
        self.metrics = {
            "accuracy": {
                "description": "% leads match criteria",
                "target": 0.90,
                "weight": 0.4
            },
            "completeness": {
                "description": "% required fields present",
                "target": 0.95,
                "weight": 0.3
            },
            "relevance": {
                "description": "% leads are relevant",
                "target": 0.85,
                "weight": 0.3
            }
        }
    
    def calculate_score(self, results: dict) -> float:
        """Calculate weighted score"""
        total_score = 0
        
        for metric, config in self.metrics.items():
            metric_score = results.get(metric, 0)
            weight = config["weight"]
            total_score += metric_score * weight
        
        return total_score
```

### Step 2: Generate Test Dataset

```python
class TestDatasetGenerator:
    """Generate realistic test data"""
    
    def generate_scout_test_cases(self) -> list:
        """Generate test cases untuk Scout Agent"""
        
        test_cases = [
            {
                "location": "Jakarta",
                "category": "restaurant",
                "min_rating": 4.0,
                "expected_fields": ["name", "rating", "address", "phone"],
                "expected_count": 5
            },
            {
                "location": "Bandung",
                "category": "klinik",
                "min_rating": 3.5,
                "expected_fields": ["name", "rating", "address", "phone"],
                "expected_count": 5
            },
            {
                "location": "Surabaya",
                "category": "cafe",
                "min_rating": 4.0,
                "expected_fields": ["name", "rating", "address", "phone"],
                "expected_count": 5
            }
        ]
        
        return test_cases
    
    def generate_closer_test_cases(self) -> list:
        """Generate test cases untuk Closer Agent"""
        
        test_cases = [
            {
                "business_name": "Warung Kopi Jaya",
                "owner_name": "Budi",
                "category": "cafe",
                "expected_elements": ["personalization", "value_prop", "urgency", "cta"]
            },
            {
                "business_name": "Klinik Gigi Sehat",
                "owner_name": "Dr. Rina",
                "category": "klinik",
                "expected_elements": ["personalization", "value_prop", "urgency", "cta"]
            }
        ]
        
        return test_cases
```

### Step 3: Run Evaluations

```python
class EvaluationRunner:
    """Run evaluations"""
    
    def __init__(self, client):
        self.client = client
        self.results = []
    
    async def run_scout_eval(self, test_cases: list) -> list:
        """Run Scout Agent evaluation"""
        
        results = []
        
        for test_case in test_cases:
            # Run Scout Agent
            scout_result = await self.run_scout_agent(test_case)
            
            # Evaluate result
            evaluation = {
                "test_case": test_case,
                "result": scout_result,
                "metrics": self.evaluate_scout_result(scout_result, test_case)
            }
            
            results.append(evaluation)
        
        return results
    
    async def run_scout_agent(self, test_case: dict) -> dict:
        """Run Scout Agent dengan test case"""
        
        prompt = f"""
        Cari {test_case['category']} di {test_case['location']} 
        dengan rating minimal {test_case['min_rating']}
        
        Return JSON dengan fields: {', '.join(test_case['expected_fields'])}
        """
        
        response = self.client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1024,
            messages=[{"role": "user", "content": prompt}]
        )
        
        return json.loads(response.content[0].text)
    
    def evaluate_scout_result(self, result: dict, test_case: dict) -> dict:
        """Evaluate Scout result"""
        
        metrics = {
            "accuracy": self.check_accuracy(result, test_case),
            "completeness": self.check_completeness(result, test_case),
            "relevance": self.check_relevance(result, test_case)
        }
        
        return metrics
    
    def check_accuracy(self, result: dict, test_case: dict) -> float:
        """Check accuracy: do leads match criteria?"""
        
        if "leads" not in result:
            return 0.0
        
        leads = result["leads"]
        matching_leads = [
            l for l in leads 
            if l.get("rating", 0) >= test_case["min_rating"]
        ]
        
        if not leads:
            return 0.0
        
        return len(matching_leads) / len(leads)
    
    def check_completeness(self, result: dict, test_case: dict) -> float:
        """Check completeness: all required fields present?"""
        
        if "leads" not in result:
            return 0.0
        
        leads = result["leads"]
        required_fields = test_case["expected_fields"]
        
        complete_count = 0
        for lead in leads:
            if all(field in lead for field in required_fields):
                complete_count += 1
        
        if not leads:
            return 0.0
        
        return complete_count / len(leads)
    
    def check_relevance(self, result: dict, test_case: dict) -> float:
        """Check relevance: are leads relevant to category?"""
        
        # This would use semantic similarity or model-based grading
        # For now, simple heuristic
        
        if "leads" not in result:
            return 0.0
        
        leads = result["leads"]
        relevant_count = 0
        
        for lead in leads:
            # Check if category matches
            if test_case["category"].lower() in lead.get("category", "").lower():
                relevant_count += 1
        
        if not leads:
            return 0.0
        
        return relevant_count / len(leads)
```

### Step 4: Analyze Results

```python
class ResultsAnalyzer:
    """Analyze evaluation results"""
    
    def analyze(self, results: list) -> dict:
        """Analyze all results"""
        
        summary = {
            "total_tests": len(results),
            "passed": 0,
            "failed": 0,
            "metrics_avg": {},
            "issues": []
        }
        
        all_metrics = {}
        
        for result in results:
            metrics = result["metrics"]
            
            # Aggregate metrics
            for metric_name, metric_value in metrics.items():
                if metric_name not in all_metrics:
                    all_metrics[metric_name] = []
                all_metrics[metric_name].append(metric_value)
            
            # Check if passed
            avg_metric = sum(metrics.values()) / len(metrics)
            if avg_metric >= 0.85:
                summary["passed"] += 1
            else:
                summary["failed"] += 1
                summary["issues"].append({
                    "test_case": result["test_case"],
                    "metrics": metrics
                })
        
        # Calculate averages
        for metric_name, values in all_metrics.items():
            summary["metrics_avg"][metric_name] = sum(values) / len(values)
        
        return summary
    
    def print_report(self, summary: dict):
        """Print evaluation report"""
        
        print("=" * 50)
        print("EVALUATION REPORT")
        print("=" * 50)
        print(f"Total Tests: {summary['total_tests']}")
        print(f"Passed: {summary['passed']} ({summary['passed']/summary['total_tests']*100:.1f}%)")
        print(f"Failed: {summary['failed']} ({summary['failed']/summary['total_tests']*100:.1f}%)")
        print("\nMetrics Average:")
        for metric, value in summary['metrics_avg'].items():
            print(f"  {metric}: {value:.2%}")
        
        if summary['issues']:
            print("\nIssues Found:")
            for issue in summary['issues']:
                print(f"  - {issue['test_case']}")
                print(f"    Metrics: {issue['metrics']}")
```

---

## 3️⃣ Generating Test Datasets: Realistic Data

### Best Practices untuk Test Data

1. **Representative**: Reflect real-world scenarios
2. **Diverse**: Cover edge cases
3. **Realistic**: Use actual data when possible
4. **Labeled**: Include expected outputs
5. **Scalable**: Easy to expand

### Test Dataset Strategies

**Strategy 1: Manual Curation**

```python
# Manually create test cases
test_cases = [
    {
        "input": "Cari restaurant di Jakarta",
        "expected_output": {
            "location": "Jakarta",
            "category": "restaurant",
            "leads_count": 5
        }
    },
    {
        "input": "Cari klinik di Bandung dengan rating > 4.0",
        "expected_output": {
            "location": "Bandung",
            "category": "klinik",
            "min_rating": 4.0,
            "leads_count": 5
        }
    }
]
```

**Strategy 2: Synthetic Generation**

```python
import random

def generate_synthetic_test_cases(count: int = 50) -> list:
    """Generate synthetic test cases"""
    
    locations = ["Jakarta", "Bandung", "Surabaya", "Medan", "Makassar"]
    categories = ["restaurant", "klinik", "cafe", "bengkel", "salon"]
    ratings = [3.0, 3.5, 4.0, 4.5, 5.0]
    
    test_cases = []
    
    for _ in range(count):
        test_case = {
            "location": random.choice(locations),
            "category": random.choice(categories),
            "min_rating": random.choice(ratings),
            "expected_count": random.randint(3, 10)
        }
        test_cases.append(test_case)
    
    return test_cases
```

**Strategy 3: Real Data**

```python
def load_real_test_cases(csv_file: str) -> list:
    """Load test cases dari CSV"""
    
    import pandas as pd
    
    df = pd.read_csv(csv_file)
    test_cases = df.to_dict('records')
    
    return test_cases
```

---

## 4️⃣ Running the Eval: Automated Testing

### Eval Framework

```python
class PromptEvaluationFramework:
    """Complete evaluation framework"""
    
    def __init__(self, client):
        self.client = client
        self.runner = EvaluationRunner(client)
        self.analyzer = ResultsAnalyzer()
    
    async def run_full_eval(self, agent_name: str, test_cases: list):
        """Run full evaluation pipeline"""
        
        print(f"🚀 Starting evaluation for {agent_name}")
        
        # Step 1: Run evaluations
        print("📊 Running test cases...")
        results = await self.runner.run_scout_eval(test_cases)
        
        # Step 2: Analyze results
        print("📈 Analyzing results...")
        summary = self.analyzer.analyze(results)
        
        # Step 3: Print report
        print("📋 Evaluation Report:")
        self.analyzer.print_report(summary)
        
        # Step 4: Determine if pass/fail
        if summary['passed'] / summary['total_tests'] >= 0.85:
            print("✅ PASSED - Ready for deployment")
            return True
        else:
            print("❌ FAILED - Need improvements")
            return False
```

### Continuous Evaluation

```python
import schedule
import time

class ContinuousEvaluation:
    """Run evaluations continuously"""
    
    def __init__(self, framework):
        self.framework = framework
    
    def schedule_eval(self, agent_name: str, test_cases: list, interval_hours: int = 24):
        """Schedule evaluation to run periodically"""
        
        async def run_eval():
            await self.framework.run_full_eval(agent_name, test_cases)
        
        schedule.every(interval_hours).hours.do(run_eval)
        
        print(f"📅 Scheduled evaluation for {agent_name} every {interval_hours} hours")
        
        # Keep scheduler running
        while True:
            schedule.run_pending()
            time.sleep(60)
```

---

## 5️⃣ Model-Based Grading: Using Claude untuk Grade

### Apa itu Model-Based Grading?

**Model-Based Grading** = Gunakan Claude untuk evaluate output dari agent lain.

### Implementasi

```python
class ModelBasedGrading:
    """Use Claude untuk grade responses"""
    
    def __init__(self, client):
        self.client = client
    
    def grade_scout_response(self, scout_output: dict, test_case: dict) -> dict:
        """Use Claude untuk grade Scout response"""
        
        grading_prompt = f"""
        Evaluate this Scout Agent response:
        
        Test Case:
        - Location: {test_case['location']}
        - Category: {test_case['category']}
        - Min Rating: {test_case['min_rating']}
        
        Agent Output:
        {json.dumps(scout_output, indent=2)}
        
        Grade on these criteria (0-100):
        1. Accuracy: Do leads match criteria?
        2. Completeness: Are all required fields present?
        3. Relevance: Are leads relevant to category?
        4. Quality: Are leads high-quality?
        
        Return JSON:
        {{
            "accuracy_score": number,
            "completeness_score": number,
            "relevance_score": number,
            "quality_score": number,
            "overall_score": number,
            "feedback": "string"
        }}
        """
        
        response = self.client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=512,
            messages=[{"role": "user", "content": grading_prompt}]
        )
        
        grades = json.loads(response.content[0].text)
        return grades
    
    def grade_closer_response(self, closer_output: str, test_case: dict) -> dict:
        """Use Claude untuk grade Closer response"""
        
        grading_prompt = f"""
        Evaluate this Closer Agent message:
        
        Business: {test_case['business_name']}
        Owner: {test_case['owner_name']}
        
        Message:
        {closer_output}
        
        Grade on these criteria (0-100):
        1. Personalization: Does it mention business/owner name?
        2. Value Proposition: Is value clear?
        3. Urgency: Is there sense of urgency?
        4. CTA: Is call-to-action clear?
        5. Tone: Is tone appropriate?
        
        Return JSON:
        {{
            "personalization_score": number,
            "value_prop_score": number,
            "urgency_score": number,
            "cta_score": number,
            "tone_score": number,
            "overall_score": number,
            "feedback": "string"
        }}
        """
        
        response = self.client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=512,
            messages=[{"role": "user", "content": grading_prompt}]
        )
        
        grades = json.loads(response.content[0].text)
        return grades
```

---

## 6️⃣ Code-Based Grading: Automated Scoring

### Apa itu Code-Based Grading?

**Code-Based Grading** = Gunakan code logic untuk evaluate output.

### Implementasi

```python
class CodeBasedGrading:
    """Use code logic untuk grade responses"""
    
    def grade_scout_response(self, scout_output: dict, test_case: dict) -> dict:
        """Grade Scout response dengan code logic"""
        
        scores = {}
        
        # Check if has leads
        if "leads" not in scout_output:
            return {
                "accuracy": 0.0,
                "completeness": 0.0,
                "relevance": 0.0,
                "overall": 0.0
            }
        
        leads = scout_output["leads"]
        
        # Accuracy: Do leads match criteria?
        matching_leads = [
            l for l in leads 
            if l.get("rating", 0) >= test_case.get("min_rating", 0)
        ]
        scores["accuracy"] = len(matching_leads) / len(leads) if leads else 0.0
        
        # Completeness: All required fields present?
        required_fields = test_case.get("expected_fields", [])
        complete_leads = [
            l for l in leads 
            if all(field in l for field in required_fields)
        ]
        scores["completeness"] = len(complete_leads) / len(leads) if leads else 0.0
        
        # Relevance: Leads relevant to category?
        category = test_case.get("category", "").lower()
        relevant_leads = [
            l for l in leads 
            if category in l.get("category", "").lower()
        ]
        scores["relevance"] = len(relevant_leads) / len(leads) if leads else 0.0
        
        # Overall score
        scores["overall"] = sum(scores.values()) / len(scores)
        
        return scores
    
    def grade_closer_response(self, closer_output: str, test_case: dict) -> dict:
        """Grade Closer response dengan code logic"""
        
        scores = {}
        
        # Personalization: Mention business/owner name?
        business_name = test_case.get("business_name", "").lower()
        owner_name = test_case.get("owner_name", "").lower()
        output_lower = closer_output.lower()
        
        has_business = business_name in output_lower
        has_owner = owner_name in output_lower
        scores["personalization"] = 1.0 if (has_business or has_owner) else 0.0
        
        # Value Proposition: Mention benefits?
        value_keywords = ["tingkat", "meningkat", "lebih", "hemat", "efisien", "cepat"]
        has_value = any(keyword in output_lower for keyword in value_keywords)
        scores["value_prop"] = 1.0 if has_value else 0.0
        
        # Urgency: Mention limited time?
        urgency_keywords = ["terbatas", "segera", "sekarang", "hari ini", "minggu ini"]
        has_urgency = any(keyword in output_lower for keyword in urgency_keywords)
        scores["urgency"] = 1.0 if has_urgency else 0.0
        
        # CTA: Clear call to action?
        cta_keywords = ["hubungi", "klik", "reply", "tanya", "daftar", "pesan"]
        has_cta = any(keyword in output_lower for keyword in cta_keywords)
        scores["cta"] = 1.0 if has_cta else 0.0
        
        # Overall score
        scores["overall"] = sum(scores.values()) / len(scores)
        
        return scores
```

---

## 7️⃣ Exercise on Prompt Evals: Hands-On Practice

### Exercise 1: Create Evaluation Framework

```python
# TODO: Create evaluation framework untuk Scout Agent
# Requirements:
# - Define metrics (accuracy, completeness, relevance)
# - Generate test dataset (5-10 test cases)
# - Run evaluations
# - Analyze results
# - Print report

async def exercise_1_scout_eval():
    """Exercise 1: Scout Agent Evaluation"""
    
    client = Anthropic()
    
    # Step 1: Define metrics
    metrics = EvaluationMetrics()
    
    # Step 2: Generate test dataset
    dataset_generator = TestDatasetGenerator()
    test_cases = dataset_generator.generate_scout_test_cases()
    
    # Step 3: Run evaluations
    runner = EvaluationRunner(client)
    results = await runner.run_scout_eval(test_cases)
    
    # Step 4: Analyze results
    analyzer = ResultsAnalyzer()
    summary = analyzer.analyze(results)
    
    # Step 5: Print report
    analyzer.print_report(summary)

# Run exercise
asyncio.run(exercise_1_scout_eval())
```

### Exercise 2: Model-Based Grading

```python
# TODO: Use Claude untuk grade Scout responses
# Requirements:
# - Use ModelBasedGrading
# - Grade multiple Scout outputs
# - Compare with code-based grading
# - Analyze differences

async def exercise_2_model_based_grading():
    """Exercise 2: Model-Based Grading"""
    
    client = Anthropic()
    grader = ModelBasedGrading(client)
    
    # Sample Scout output
    scout_output = {
        "leads": [
            {"name": "Warung Kopi Jaya", "rating": 4.5, "address": "Jl. Sudirman"},
            {"name": "Cafe Indah", "rating": 4.2, "address": "Jl. Gatot Subroto"}
        ]
    }
    
    test_case = {
        "location": "Jakarta",
        "category": "cafe",
        "min_rating": 4.0
    }
    
    # Grade dengan model-based grading
    grades = grader.grade_scout_response(scout_output, test_case)
    print(f"Model-Based Grades: {grades}")
    
    # Grade dengan code-based grading
    code_grades = CodeBasedGrading().grade_scout_response(scout_output, test_case)
    print(f"Code-Based Grades: {code_grades}")
    
    # Compare
    print("Comparison:")
    print(f"  Overall (Model): {grades['overall_score']}")
    print(f"  Overall (Code): {code_grades['overall']}")
```

---

## 8️⃣ Quiz on Prompt Evaluation: Assessment Prep

### Sample Quiz Questions

**Topic 1: Evaluation Overview**

```
Q1: Mengapa prompt evaluation penting?
A: Untuk memastikan prompt bekerja dengan baik sebelum deploy
   Identify issues early
   Measure quality metrics
   Enable continuous improvement

Q2: Apa evaluation metrics untuk Scout Agent?
A: - Accuracy: % leads match criteria
   - Completeness: % required fields present
   - Relevance: % leads relevant to category

Q3: Apa target score untuk production deployment?
A: Minimum 85% pass rate
   Accuracy > 90%
   Completeness > 95%
   Relevance > 85%
```

**Topic 2: Test Dataset**

```
Q1: Bagaimana generate test dataset?
A: - Manual curation (create by hand)
   - Synthetic generation (random data)
   - Real data (from production)

Q2: Apa karakteristik good test dataset?
A: - Representative (reflect real scenarios)
   - Diverse (cover edge cases)
   - Realistic (use actual data)
   - Labeled (include expected outputs)
   - Scalable (easy to expand)

Q3: Berapa test cases yang ideal?
A: Minimum 10-20 per agent
   Lebih banyak lebih baik
   Prioritas: quality over quantity
```

**Topic 3: Running Evaluations**

```
Q1: Apa steps dalam eval workflow?
A: 1. Define metrics
   2. Generate test dataset
   3. Run evaluations
   4. Analyze results
   5. Identify issues
   6. Iterate & improve
   7. Deploy (if pass)

Q2: Bagaimana automate evaluation?
A: Gunakan EvaluationRunner class
   Schedule periodic runs
   Monitor metrics continuously
   Alert jika score drop

Q3: Bagaimana handle eval failures?
A: - Identify root cause
   - Modify prompt
   - Re-run evaluation
   - Iterate until pass
```

**Topic 4: Model-Based vs Code-Based Grading**

```
Q1: Apa perbedaan model-based dan code-based grading?
A: Model-based: Use Claude untuk grade
   Code-based: Use code logic untuk grade

Q2: Kapan gunakan model-based grading?
A: Untuk subjective criteria (tone, clarity)
   Untuk complex evaluation
   Untuk nuanced feedback

Q3: Kapan gunakan code-based grading?
A: Untuk objective criteria (field presence)
   Untuk fast evaluation
   Untuk deterministic scoring

Q4: Bagaimana combine keduanya?
A: Use code-based untuk basic checks
   Use model-based untuk detailed evaluation
   Compare results untuk validation
```

### Study Tips

1. **Understand WHY**: Jangan hanya hafal, pahami mengapa evaluation penting
2. **Hands-on Practice**: Implementasikan evaluation framework
3. **Test dengan Real Data**: Use actual agent outputs
4. **Iterate**: Modify prompts dan re-evaluate
5. **Monitor**: Track metrics over time

---

## 🎯 Kesimpulan

**Prompt Evaluation** adalah essential untuk production-ready systems:

✅ **Define Metrics**: Clear success criteria  
✅ **Generate Test Data**: Realistic, diverse data  
✅ **Run Evaluations**: Automated testing  
✅ **Model-Based Grading**: Subjective evaluation  
✅ **Code-Based Grading**: Objective evaluation  
✅ **Analyze Results**: Identify issues  
✅ **Iterate**: Continuous improvement  

Dalam Sovereign Predator Suite:
- **Scout Agent**: Evaluate accuracy, completeness, relevance
- **Closer Agent**: Evaluate personalization, value prop, urgency, CTA
- **Architect Agent**: Evaluate code quality, responsiveness, performance

**Gyss! 😌👹 Dengan menguasai Prompt Evaluation, Anda siap untuk deploy production-ready agents dengan confidence! 🔥👑👑👑**

---

## 📚 Referensi

[1] Anthropic. (2026). *Building with the Claude API - Prompt Evaluation*. https://anthropic.skilljar.com/claude-with-the-anthropic-api/
[2] Anthropic. (2026). *Evaluation Best Practices*. https://docs.anthropic.com/
