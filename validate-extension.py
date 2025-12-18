#!/usr/bin/env python3

import json
import os
import subprocess

def validate_extension():
    print("🔍 Chrome Extension Validation Report")
    print("=" * 50)
    
    # Test manifest.json validity
    try:
        with open('manifest.json', 'r') as f:
            manifest = json.load(f)
        print('✅ manifest.json is valid JSON')
        print(f'✅ Extension name: {manifest.get("name", "N/A")}')
        print(f'✅ Version: {manifest.get("version", "N/A")}')
        print(f'✅ Manifest version: {manifest.get("manifest_version", "N/A")}')
        
        # Check manifest structure
        required_fields = ['name', 'version', 'manifest_version', 'permissions', 'action']
        missing_fields = [field for field in required_fields if field not in manifest]
        if not missing_fields:
            print('✅ All required manifest fields present')
        else:
            print(f'❌ Missing manifest fields: {missing_fields}')
            
    except Exception as e:
        print(f'❌ manifest.json error: {e}')
        return False
    
    print()
    
    # Check required files
    required_files = [
        'manifest.json',
        'popup.html', 
        'popup.js',
        'background.js',
        'script.js',
        'icon.png'
    ]
    
    optional_files = ['styles.css']
    
    print('📁 File Structure Check:')
    all_files_exist = True
    
    for file in required_files:
        if os.path.exists(file):
            size = os.path.getsize(file)
            print(f'✅ {file} (Required) - {size} bytes')
        else:
            print(f'❌ {file} (Missing)')
            all_files_exist = False
    
    for file in optional_files:
        if os.path.exists(file):
            size = os.path.getsize(file)
            print(f'✅ {file} (Optional) - {size} bytes')
        else:
            print(f'⚠️ {file} (Optional - missing)')
    
    print()
    
    # Test JavaScript syntax
    js_files = ['popup.js', 'background.js', 'script.js']
    print('🔧 JavaScript Syntax Check:')
    
    for js_file in js_files:
        if os.path.exists(js_file):
            try:
                result = subprocess.run(['node', '--check', js_file], 
                                      capture_output=True, text=True)
                if result.returncode == 0:
                    print(f'✅ {js_file} - No syntax errors')
                else:
                    print(f'❌ {js_file} - Syntax error: {result.stderr}')
                    all_files_exist = False
            except Exception as e:
                print(f'⚠️ {js_file} - Could not check syntax: {e}')
        else:
            print(f'❌ {js_file} - File not found')
            all_files_exist = False
    
    print()
    
    # Test HTML validation
    html_files = ['popup.html']
    print('🌐 HTML Structure Check:')
    
    for html_file in html_files:
        if os.path.exists(html_file):
            with open(html_file, 'r') as f:
                content = f.read()
            
            # Basic HTML structure checks
            checks = [
                ('<!DOCTYPE html>' in content, 'Has DOCTYPE'),
                ('<html' in content, 'Has html tag'),
                ('<head>' in content, 'Has head section'),
                ('<body>' in content, 'Has body section'),
                ('startButton' in content, 'Has start button'),
                ('debugButton' in content, 'Has debug button')
            ]
            
            for check, desc in checks:
                if check:
                    print(f'✅ {html_file} - {desc}')
                else:
                    print(f'⚠️ {html_file} - Missing {desc}')
        else:
            print(f'❌ {html_file} - File not found')
            all_files_exist = False
    
    print()
    
    # Final assessment
    if all_files_exist:
        print('🎉 Extension is ready to be loaded into Chrome!')
        print()
        print('📋 Instructions:')
        print('1. Open Chrome and go to chrome://extensions/')
        print('2. Enable "Developer mode"')
        print('3. Click "Load unpacked"')
        print('4. Select this folder')
        print('5. Extension will be ready to use!')
        print()
        print('🔧 Debug Features Added:')
        print('- Debug button in popup interface')
        print('- Automatic debug detection')
        print('- Redirect to chrome://extensions/ for debugging')
        return True
    else:
        print('❌ Extension has issues that need to be fixed')
        return False

if __name__ == '__main__':
    validate_extension()
