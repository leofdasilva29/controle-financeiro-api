import { Router } from 'express';
import * as controller from '../controllers/usuarioController';

const router = Router();

router.get('/usuarios', controller.listarUsuarios);
router.post('/usuarios', controller.criarUsuario);
router.put('/usuarios/:id', controller.atualizarUsuario);
router.delete('/usuarios/:id', controller.deletarUsuario);

export default router;
