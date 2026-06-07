
interface BloomCircle {
  x: number;
  y: number;
  startTime: number;
  zone: number;
}

export class MelodyVisualizer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private currentZone: number = 0;
  private hitCounts: number[] = [0, 0, 0, 0, 0, 0, 0, 0];
  private bloomCircles: BloomCircle[] = [];
  private animationId: number | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  private resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  setCurrentZone(zone: number) {
    this.currentZone = zone;
  }

  triggerZone(zone: number) {
    this.hitCounts[zone]++;
    const centerX = this.canvas.width / 2;
    const zoneHeight = this.canvas.height / 8;
    const y = (zone + 0.5) * zoneHeight;

    this.bloomCircles.push({
      x: centerX,
      y,
      startTime: performance.now(),
      zone,
    });
  }

  private getZoneColor(zone: number, intensity: number = 1): string {
    const colors = [
      '#ff6b35', // warm orange
      '#f7931e', // orange
      '#fbb034', // gold
      '#fddd4e', // yellow
      '#7ec8e3', // light cyan
      '#55a7ce', // cyan
      '#5b7fbf', // blue
      '#7c3aed', // violet
    ];

    const color = colors[zone];
    const alpha = 0.3 + 0.4 * intensity;
    return color + Math.round(alpha * 255).toString(16).padStart(2, '0');
  }

  render() {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const now = performance.now();
    const zoneHeight = height / 8;

    // Clear background
    this.ctx.fillStyle = '#080810';
    this.ctx.fillRect(0, 0, width, height);

    // Draw vertical gradient bands (notes)
    const maxHits = Math.max(1, ...this.hitCounts);

    for (let i = 0; i < 8; i++) {
      const y = i * zoneHeight;
      const intensity = this.hitCounts[i] / maxHits;

      // Base band with heat saturation
      const color = this.getZoneColor(i, intensity);
      this.ctx.fillStyle = color;
      this.ctx.fillRect(0, y, width, zoneHeight);

      // Border
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(0, y, width, zoneHeight);
    }

    // Draw zone cursor (horizontal glowing band)
    const cursorY = (this.currentZone + 0.5) * zoneHeight;
    const cursorGradient = this.ctx.createLinearGradient(0, cursorY - 20, 0, cursorY + 20);
    cursorGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
    cursorGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
    cursorGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    this.ctx.fillStyle = cursorGradient;
    this.ctx.fillRect(0, cursorY - 30, width, 60);

    // Draw scale strip on right edge
    for (let i = 0; i < 8; i++) {
      const y = i * zoneHeight;
      const isActive = i === this.currentZone;

      this.ctx.fillStyle = isActive ? '#f0abfc' : this.getZoneColor(i, 0.5);
      this.ctx.beginPath();
      this.ctx.arc(width - 20, y + zoneHeight / 2, isActive ? 8 : 5, 0, Math.PI * 2);
      this.ctx.fill();

      if (isActive) {
        this.ctx.strokeStyle = '#f0abfc';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
      }
    }

    // Draw bloom circles
    this.bloomCircles = this.bloomCircles.filter((bloom) => {
      const elapsed = now - bloom.startTime;
      if (elapsed > 600) return false;

      const progress = elapsed / 600;
      const maxRadius = Math.min(width / 2, 200);
      const radius = maxRadius * progress;
      const alpha = 1 - progress;

      // Main bloom
      this.ctx.strokeStyle = `rgba(240, 171, 252, ${alpha * 0.5})`;
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(bloom.x, bloom.y, radius, 0, Math.PI * 2);
      this.ctx.stroke();

      // Harmonic overtone rings
      for (let i = 1; i <= 2; i++) {
        const overtoneRadius = radius * (1 + i * 0.3);
        this.ctx.strokeStyle = `rgba(124, 58, 237, ${alpha * 0.3 / i})`;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(bloom.x, bloom.y, overtoneRadius, 0, Math.PI * 2);
        this.ctx.stroke();
      }

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
