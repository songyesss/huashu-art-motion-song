// Dao of All Things · 片头/收尾文字卡 —— 纯代码，无卡通人物。
// 管线：①宣纸（缓存）→ ②"道"字：fillText 保证字形100%正确 → 走 P.inkWash 晕染成墨色
//      → ③英文标题+副标题（居中，宋体感衬线） → ④钤印"宋"
// 字形用 fillText 不用手描笔画路径：手描复杂汉字笔画风险高（容易描走样），
// fillText 保证字绝对正确，再用 P.inkWash 做墨晕+multiply，照样是"画出来"的质感，不是贴图字幕。
// 注：引擎不会调用场景自带的 label(c,lt)（engine.js 的 drawEra 只调用 e.draw，标题全部并进 draw 里）。
SCENES['99_dao_title'] = (() => {
  const W = 1920, H = 1080, { clamp, lerp, rng, ease, ss } = U, P = PAINT;

  const paper = () => P.cached('dao_paper', W, H, (g) => {
    g.drawImage(P.texture('dao_xuan', '#f2e8d3', { scale: 0.0025, amt: 7, grain: 6, seed: 11 }), 0, 0);
    const r = rng(77);
    g.lineCap = 'round';
    for (let i = 0; i < 1800; i++) {
      const x = r() * W, y = r() * H, a = r() * Math.PI * 2, l = 6 + r() * 24;
      g.strokeStyle = r() < 0.5 ? `rgba(150,125,90,${0.04 + r() * 0.07})` : `rgba(255,252,240,${0.1 + r() * 0.13})`;
      g.lineWidth = 0.6 + r() * 0.8; g.beginPath(); g.moveTo(x, y);
      g.quadraticCurveTo(x + Math.cos(a + 0.6) * l * 0.5, y + Math.sin(a + 0.6) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke();
    }
    const vg = g.createRadialGradient(W / 2, H / 2, 420, W / 2, H / 2, 1200);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(110,80,45,.2)');
    g.fillStyle = vg; g.fillRect(0, 0, W, H);
  });

  const washLayer = (c, key, grow, fn, o) => P.inkWash(c, 'dao_' + key, grow, fn, o);

  function daoGlyph(g) {
    g.save(); g.font = '440px "LXGWWenKai-500"'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = '#14120f';
    g.fillText('道', W / 2, 410);
    g.restore();
  }

  return {
    draw(c, lt, t) {
      const rev = clamp(lt / 1.1);
      const grow = ss(0.15, 2.6, lt);
      c.drawImage(paper(), 0, 0);

      c.save(); c.globalAlpha = ss(0, 0.9, lt);
      washLayer(c, 'glyph', grow, daoGlyph, { blur: 2, halo: 11, haloA: 0.26 });
      c.restore();

      const ta = ss(0.95, 1.45, lt);
      if (ta > 0) {
        c.save(); c.textAlign = 'center'; c.textBaseline = 'alphabetic';
        c.font = '54px "LXGWWenKai-500"'; c.letterSpacing = '10px';
        c.fillStyle = `rgba(20,18,15,${0.92 * ta})`;
        c.fillText('DAO OF ALL THINGS', W / 2, 760);
        c.letterSpacing = '0px';
        c.font = '28px "LXGWWenKai-500"';
        c.fillStyle = `rgba(50,44,36,${0.8 * ta})`;
        c.fillText('Read the old text. Keep what works.', W / 2, 810);
        c.restore();
      }

      const q = ss(1.4, 1.7, lt);
      if (q > 0) {
        const s = 1.4 - 0.4 * ease.out(q);
        const seal = P.cached('dao_seal', 80, 80, g => {
          g.translate(40, 40);
          g.fillStyle = '#c4281e'; g.fillRect(-34, -34, 68, 68);
          g.globalCompositeOperation = 'destination-out';
          g.font = '40px "LXGWWenKai-500"'; g.textAlign = 'center'; g.textBaseline = 'middle';
          g.fillText('宋', 0, 1);
          const r = rng(13); for (let i = 0; i < 40; i++) g.fillRect(-34 + r() * 68, -34 + r() * 68, 1 + r() * 3, 1 + r() * 2);
        });
        c.save(); c.translate(W / 2, 900); c.scale(s, s); c.globalAlpha = Math.min(1, q * 1.6);
        c.globalCompositeOperation = 'multiply'; c.drawImage(seal, -40, -40); c.restore();
      }
    },
  };
})();
