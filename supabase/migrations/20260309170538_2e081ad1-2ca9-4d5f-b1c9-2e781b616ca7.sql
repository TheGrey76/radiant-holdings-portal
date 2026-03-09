CREATE TABLE public.gp_scoring_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  fund_name text NOT NULL DEFAULT '',
  gp_name text NOT NULL DEFAULT '',
  assessment_date text NOT NULL DEFAULT '',
  score numeric NOT NULL DEFAULT 0,
  verdict text NOT NULL DEFAULT 'fail',
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.gp_scoring_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own assessments"
  ON public.gp_scoring_assessments FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own assessments"
  ON public.gp_scoring_assessments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own assessments"
  ON public.gp_scoring_assessments FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own assessments"
  ON public.gp_scoring_assessments FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE TRIGGER update_gp_scoring_assessments_updated_at
  BEFORE UPDATE ON public.gp_scoring_assessments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();