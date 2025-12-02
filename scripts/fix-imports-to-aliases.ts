import { Project } from 'ts-morph';
import path from 'path';

const ALIAS_MAP: Record<string, string> = {
  'src/shared': '@shared',
  'src/auth': '@auth',
  'src/users': '@users',
  'src/projects': '@projects',
  'src/sprints': '@sprints',
  'src/tasks': '@tasks',
  'src/clients': '@clients',
  'src/meetings': '@meetings',
  'src/goals': '@goals',
  'src/risks': '@risks',
  'src/user-stories': '@user-stories',
  'src/feedback': '@feedback',
  'src/achievements': '@achievements',
  'src/time-entries': '@time-entries',
  'src/notifications': '@notifications',
  'src/finances': '@finances',
  'src/metrics': '@metrics',
  'src/database': '@database',
};

async function fixImports() {
  try {
    const project = new Project({
      tsConfigFilePath: 'tsconfig.json',
    });

    const sourceFiles = project.getSourceFiles('src/**/*.ts');
    let fixedCount = 0;

    sourceFiles.forEach((sourceFile) => {
      const imports = sourceFile.getImportDeclarations();
      
      imports.forEach((imp) => {
        const moduleSpecifier = imp.getModuleSpecifierValue();
        
        // Skip if already using an alias
        if (moduleSpecifier.startsWith('@')) {
          return;
        }

        // Only process relative imports
        if (!moduleSpecifier.startsWith('.')) {
          return;
        }

        const sourceFilePath = sourceFile.getFilePath();
        const sourceDir = path.dirname(sourceFilePath);
        
        // Resolve relative path to absolute
        const absolutePath = path.resolve(sourceDir, moduleSpecifier);
        const normalizedPath = path.normalize(absolutePath).replace(/\\/g, '/');

        // Find matching alias
        let newSpecifier: string | null = null;
        for (const [srcPath, alias] of Object.entries(ALIAS_MAP)) {
          const aliasPath = path.resolve(process.cwd(), srcPath).replace(/\\/g, '/');
          if (normalizedPath.startsWith(aliasPath)) {
            const relativePart = path.relative(aliasPath, normalizedPath).replace(/\\/g, '/');
            newSpecifier = relativePart ? `${alias}/${relativePart}` : alias;
            break;
          }
        }

        if (newSpecifier && newSpecifier !== moduleSpecifier) {
          imp.setModuleSpecifier(newSpecifier);
          fixedCount++;
          console.log(`✅ ${sourceFile.getBaseName()}: ${moduleSpecifier} → ${newSpecifier}`);
        }
      });
    });

    await project.save();
    console.log(`\n✅ Total de imports arreglados: ${fixedCount}`);
  } catch (error) {
    console.error('❌ Error actualizando imports:', error);
    process.exit(1);
  }
}

void fixImports();
