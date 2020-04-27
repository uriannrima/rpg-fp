export class SkillNotFound extends Error {
  constructor(skillName) {
    super();
    this.message = `Skill "${skillName}" not found.`;
  }
}
