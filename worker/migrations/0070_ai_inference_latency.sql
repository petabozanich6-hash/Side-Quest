-- Additive timing measurement for each Workers AI call.
-- Metadata only; no family, learner, request text, or response content.
ALTER TABLE ai_inference_costs ADD COLUMN duration_ms INTEGER;
