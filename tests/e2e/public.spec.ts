import {test,expect} from '@playwright/test';
test('navigation marketing et tarification honnête',async({page})=>{
 await page.goto('/');
 await expect(page.getByRole('heading',{level:1})).toContainText('Ce qui vous anime');
 await page.getByRole('link',{name:'Tarifs'}).first().click();
 await expect(page.getByText('Les abonnements payants ne sont pas encore disponibles')).toBeVisible();
});
test('pages privées redirigent sans cookie vérifié',async({page})=>{
 await page.goto('/app');
 await expect(page).toHaveURL(/connexion/);
 await page.goto('/admin');
 await expect(page).toHaveURL(/connexion/);
});
