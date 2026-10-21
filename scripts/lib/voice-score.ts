export type VoiceExpectation = {
  id: string;
  focus: string;
  amounts: string[];
  dates: string[];
  names: string[];
  present: string[];
  absent: string[];
};

export function scoreVoiceCase(transcript: string, item: VoiceExpectation) {
  const text = transcript.toLowerCase();
  const check = (values: string[]) =>
    values.filter((value) => !text.includes(value.toLowerCase()));
  const missing = [
    ...check(item.amounts).map((value) => `amount ${value}`),
    ...check(item.dates).map((value) => `date ${value}`),
    ...check(item.names).map((value) => `name ${value}`),
    ...check(item.present).map((value) => `phrase ${value}`),
  ];
  const forbidden = item.absent.filter((value) => text.includes(value.toLowerCase()));
  return {
    id: item.id,
    focus: item.focus,
    missing,
    forbidden,
    passed: missing.length === 0 && forbidden.length === 0,
  };
}
