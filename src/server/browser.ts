import chromium from '@sparticuz/chromium-min';
import puppeteer from 'puppeteer';

async function launchBrowser() {
  const viewport = {
    deviceScaleFactor: 1,
    hasTouch: false,
    height: 1080,
    isLandscape: true,
    isMobile: false,
    width: 1920,
  };

  return puppeteer.launch({
    args: puppeteer.defaultArgs({ args: chromium.args, headless: 'shell' }),
    defaultViewport: viewport,
    executablePath: await chromium.executablePath(
      `https://github.com/Sparticuz/chromium/releases/download/v138.0.0/chromium-v138.0.0-pack.x64.tar`
    ),
    headless: 'shell',
  });
}

export const browser = await launchBrowser();
