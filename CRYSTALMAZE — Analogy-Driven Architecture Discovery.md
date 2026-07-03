# CRYSTALMAZE — Analogy-Driven Architecture Discovery

### The Problem
Junior developers (and even senior ones) struggle with novel architectural problems. They Google, they read Stack Overflow, they try patterns — but they don't *see* the structural similarity between their problem and problems already solved in completely different domains.

### What It Changes
**The agent acts as a cross-domain invention engine.** You describe your technical problem. It maps the structural pattern to problems in biology, economics, physics, logistics, manufacturing, etc. Then it synthesizes a domain-specific architecture that leverages proven solutions from other fields.

### Tool Composition (4 Tools)

```
┌─────────────────────────┐
│  novel-concepts         │
│  analogy_synthesizer    │  ← Takes problem description, produces cross-domain
│  (abstraction: "deep")  │    structural analogies with mapping tables
└──────────┬──────────────┘
           │ analogies[] (problem ↔ source domain mappings)
           ▼
┌─────────────────────────┐
│  novel-concepts         │
│  concept_web_weaver     │  ← Registers the analogy relationships in a
│  (action: "register")   │    semantic graph. Strengthens connections
│                         │    between the problem and analogous solutions.
└──────────┬──────────────┘
           │ concept_graph
           ▼
┌─────────────────────────┐
│  novel-concepts         │
│  consensus_protocol     │  ← Runs multi-perspective analysis on the
│  (perspectives:         │    proposed architecture: security, performance,
│   [security, perf,      │    maintainability, UX. Flags weaknesses.
│   maintainability, ux]) │
└──────────┬──────────────┘
           │ consensus_report (strengths, weaknesses, confidence)
           ▼
┌─────────────────────────┐
│  floyd-supercache       │
│  cache_store_reasoning  │  ← Stores the entire reasoning chain:
│                         │    problem → analogy → architecture → consensus
│                         │    Future similar problems retrieve this chain.
└─────────────────────────┘
```

### Execution Procedure

1. **EXTRACT**: User describes their problem: "I need to manage 500 microservices that share state but can't use a central database"
2. **ANALOGIZE**: `analogy_synthesizer` finds:
   - 🧬 Biology: How ant colonies coordinate without central control (stigmergy)
   - 🏭 Manufacturing: How Toyota manages just-in-time parts delivery (Kanban)
   - 🌊 Physics: How wave interference patterns resolve without central coordination
3. **WEAVE**: `concept_web_weaver` builds:
   - Node: `distributed_state_management`
   - Edges: `implements → stigmergy_pattern`, `generalizes → event_sourcing`, `conflicts_with → central_database`
4. **STRESS-TEST**: `consensus_protocol` evaluates:
   - Security: "Stigmergy pattern has no auth boundary — add service mesh"
   - Performance: "Ant-colony approach has O(n²) message overhead at scale — consider gossip protocol"
   - UX: "N/A for backend"
5. **CRYSTALLIZE**: `cache_store_reasoning` persists the entire chain so the next developer who faces a similar problem gets the pre-analyzed solution instantly

### Why It's Game-Changing
This is **TRIZ for software architecture** — a formal method for invention by analogy. No existing tool does this for code. It turns every solved problem into a reusable invention pattern. The knowledge graph grows with every use.

### Public Use Case
```bash
$ agent crystalmaze "My API rate limiter is being bypassed because requests come from 1000 IPs"
# → Analogy: Immune system pattern recognition (antigen matching)
# → Analogy: Airport security behavioral analysis
# → Architecture: Adaptive fingerprinting + behavioral scoring (from immune analogy)
# → Consensus: Security ✓, Performance ⚠ (add caching layer), Maintainability ✓
# → Stored as pattern: "rate_limit_evasion:adaptive_fingerprinting"
```