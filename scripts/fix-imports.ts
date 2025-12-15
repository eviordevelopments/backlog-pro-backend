import { Project } from 'ts-morph';
import path from 'path';

async function fixAbsoluteImports(): Promise<void> {
  try {
    console.log('🔎 Arreglando imports absolutos...\n');

    const project = new Project({
      tsConfigFilePath: 'tsconfig.json',
    });

    const sourceFiles = project.getSourceFiles(['src/**/*.ts', 'test/**/*.ts']);
    let fixedCount = 0;

    for (const sourceFile of sourceFiles) {
      const sourceFilePath = sourceFile.getFilePath();
      const sourceDir = path.dirname(sourceFilePath);

      for (const imp of sourceFile.getImportDeclarations()) {
        const spec = imp.getModuleSpecifierValue();

        // Solo procesar imports que empiecen con 'src/'
        if (spec.startsWith('src/')) {
          // Convertir a ruta relativa
          const absolutePath = path.resolve('.', spec.replace(/\.js$/, '.ts'));
          let relativePath = path.relative(sourceDir, absolutePath).replace(/\\/g, '/');
          relativePath = relativePath.replace(/\.ts$/, '.js');
          
          if (!relativePath.startsWith('.')) {
            relativePath = './' + relativePath;
          }
          
          imp.setModuleSpecifier(relativePath);
          fixedCount++;
          console.log(`🔧 ${sourceFile.getBaseName()}: ${spec} → ${relativePath}`);
        }
      }
    }

    await project.save();

    console.log('\n───────────── RESULTADOS ─────────────');
    console.log(`✔️ Imports absolutos arreglados: ${fixedCount}`);
    console.log('──────────────────────────────────────');
  } catch (error) {
    console.error('❌ Error arreglando imports:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

void fixAbsoluteImports();