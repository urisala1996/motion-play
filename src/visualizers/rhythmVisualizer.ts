import { DRUM_COLORS } from '../audio/rhythmEngine';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export class RhythmVisualizer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private hitCounts: number[] = [0, 0, 0, 0, 0, 0];
  private wedgeFadeouts: number[] = [0, 0, 0, 0, 0, 0];
  private expandingRings: Array<{ startTime: number; zone: number }> = [];
  private animationId: number | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  private resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.ctx.scale(dpr, dpr);
  }

  triggerZone(zone: number) {
    this.hitCounts[zone]++;
    this.wedgeFadeouts[zone] = 400;

    this.expandingRings.push({
      startTime: performance.now(),
      zone,
    });

    const rect = this.canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const angle = (zone * 60 + 30) * (Math.PI / 180);

    for (let i = 0; i < 30; i++) {
      const speed = 150 + Math.random() * 150;
      const spread = (Math.random() - 0.5) * 0.6;
      this.particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle + spread) * speed,
        vy: Math.sin(angle + spread) * speed,
        life: 600,
        maxLife: 600,
      });
    }
  }

  private drawWedge(
    centerX: number,
    centerY: number,
    innerRadius: number,
    outerRadius: number,
    startAngle: number,
    endAngle: number,
    color: string,
    alpha: number
  ) {
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, innerRadius, startAngle, endAngle);
    this.ctx.arc(centerX, centerY, outerRadius, endAngle, startAngle, true);
    this.ctx.closePath();
    this.ctx.fillStyle = color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
    this.ctx.fill();
  }

  render() {
    const rect = this.canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const now = performance.now();

    this.ctx.fillStyle = '#1a0033';
    this.ctx.fillRect(0, 0, width, height);

    const innerRadius = 60;
    const outerRadius = 200;
    const maxHits = Math.max(1, ...this.hitCounts);

    const colors = Object.values(DRUM_COLORS) as string[];

    for (let i = 0; i < 6; i++) {
      const startAngle = ((i * 60 - 30) * Math.PI) / 180;
      const endAngle = (((i + 1) * 60 - 30) * Math.PI) / 180;
      const color = colors[i];

      const heatAlpha = this.hitCounts[i] / maxHits * 0.4;
      this.ctx.strokeStyle = color.replace(')', `, ${heatAlpha})`).replace('rgb', 'rgba');
      this.ctx.lineWidth = 8;
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, outerRadius + 30, startAngle, endAngle);
      this.ctx.stroke();

      const fadeAlpha = Math.min(1, this.wedgeFadeouts[i] / 400) * 0.5 + 0.2;
      this.drawWedge(centerX, centerY, innerRadius, outerRadius, startAngle, endAngle, color, fadeAlpha);

      this.wedgeFadeouts[i] -= 16;
    }

    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, innerRadius - 10, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    this.expandingRings = this.expandingRings.filter((ring) => {
      const elapsed = now - ring.startTime;
      if (elapsed > 400) return false;

      const progress = elapsed / 400;
      const radius = outerRadius + 100 * progress;
      const alpha = 1 - progress;

      this.ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
      this.ctx.lineWidth = 4;
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      this.ctx.stroke();

      return true;
    });

    this.particles = this.particles.filter((p) => {
      p.life -= 16;
      if (p.life <= 0) return false;

      p.x += p.vx * 0.016;
      p.y += p.vy * 0.016;

      const alpha = p.life / p.maxLife;
      this.ctx.fillStyle = `rgba(240, 171, 252, ${alpha * 0.6})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      this.ctx.fill();

      return true;
    });

    this.animationId = requestAnimationFrame(() => this.render());
  }

  start() {
    this.animationId = requestAnimationFrame(() => this.render());
  }

  stop() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  dispose() {
    this.stop();
    window.removeEventListener('resize', () => this.resizeCanvas());
  }
}
