import test from "node:test";
import assert from "node:assert/strict";
import { fastLessonPipelineEnabled } from "../src/aiPipeline.ts";

test("paid-family speed rollout uses an explicit server-side configuration flag", () => {
  assert.equal(fastLessonPipelineEnabled({}), false);
  assert.equal(fastLessonPipelineEnabled({ AI_FAST_PIPELINE: "false" }), false);
  assert.equal(fastLessonPipelineEnabled({ AI_FAST_PIPELINE: "true" }), true);
});

test("emergency halt overrides enabled rollout for every AI entry point", () => {
  assert.equal(fastLessonPipelineEnabled({ AI_FAST_PIPELINE: "true", AI_FAST_PIPELINE_STOP: "true" }), false);
  assert.equal(fastLessonPipelineEnabled({ AI_FAST_PIPELINE: "true", AI_FAST_PIPELINE_STOP: "false" }), true);
  assert.equal(fastLessonPipelineEnabled({ AI_FAST_PIPELINE_STOP: "true" }), false);
});
