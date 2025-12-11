import { Project } from 'ts-morph';
import path from 'path';
import fs from 'fs';

async function fixImports() {
  try {
    console.log('🔎 Analizando proyecto...\n');

    const project = new Project({
      tsConfigFilePath: 'tsconfig.json',
    });

    const sourceFiles = project.getSourceFiles(['src/**/*.ts', 'test/**/*.ts']);
    const SRC_ROOT = path.resolve('src');
    const TEST_ROOT = path.resolve('test');

    let fixedCount = 0;
    let brokenCount = 0;

    for (const sourceFile of sourceFiles) {
      const sourceFilePath = sourceFile.getFilePath();
      const sourceDir = path.dirname(sourceFilePath);

      for (const imp of sourceFile.getImportDeclarations()) {
        const spec = imp.getModuleSpecifierValue();
        const resolved = imp.getModuleSpecifierSourceFile();

        // Detectar imports rotos relativos
        if (!resolved && spec.startsWith('.')) {
          const abs = path.resolve(sourceDir, spec + '.ts');
          const absIndex = path.resolve(sourceDir, spec, 'index.ts');

          if (!fs.existsSync(abs) && !fs.existsSync(absIndex)) {
            console.warn(`❌ Import roto en ${sourceFile.getBaseName()}: ${spec}`);
            brokenCount++;
          }
          continue;
        }

        // Solo procesar imports que resuelvan a un archivo
        if (!resolved) continue;

        const targetPath = resolved.getFilePath();

        // Solo arreglar imports dentro de /src o /test
        if (!targetPath.startsWith(SRC_ROOT) && !targetPath.startsWith(TEST_ROOT)) continue;

        // Si ya es relativo, no tocarlo
        if (spec.startsWith('.')) continue;

        // Convertir a relativo
        let rel = path.relative(sourceDir, targetPath).replace(/\\/g, '/');
        rel = rel.replace(/\.ts$/, '');
        if (!rel.startsWith('.')) rel = './' + rel;

        imp.setModuleSpecifier(rel);
        fixedCount++;

        console.log(`🔧 ${sourceFile.getBaseName()}: ${spec} → ${rel}`);
      }

      // Ordenar imports
      sourceFile.organizeImports();
    }

    await project.save();

    console.log('\n───────────── RESULTADOS ─────────────');
    console.log(`✔️ Imports arreglados:        ${fixedCount}`);
    console.log(`⚠️ Imports rotos detectados:  ${brokenCount}`);
    console.log('──────────────────────────────────────');
  } catch (error: unknown) {
    console.error('❌ Error actualizando imports:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

void fixImports();
