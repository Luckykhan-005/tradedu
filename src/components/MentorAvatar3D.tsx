import { useEffect, useRef, useState } from 'react'
import { Bot } from 'lucide-react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { cn } from '@/lib/cn'

type Status = 'loading' | 'ready' | 'error'

interface MentorAvatar3DProps {
  className?: string
  /** true = poora body frame (chat ke right side panel), false = head/upper-body (header avatar) */
  fullBody?: boolean
}

export default function MentorAvatar3D({ className, fullBody = false }: MentorAvatar3DProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    let disposed = false
    let cleanup: (() => void) | null = null
    let started = false
    const desktopMq = window.matchMedia('(min-width: 640px)')

    const start = () => {
      if (started || disposed || !desktopMq.matches) return
      started = true

      let renderer: THREE.WebGLRenderer
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
      } catch {
        setStatus('error')
        return
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      renderer.domElement.style.width = '100%'
      renderer.domElement.style.height = '100%'
      renderer.domElement.style.display = 'block'
      wrap.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 60)

      const hemi = new THREE.HemisphereLight(0xffffff, 0x3a4a66, 1.3)
      scene.add(hemi)
      const key = new THREE.DirectionalLight(0xffffff, 2.4)
      key.position.set(3, 5, 4)
      scene.add(key)
      const rim = new THREE.DirectionalLight(0x9db8ff, 1.2)
      rim.position.set(-3, 3, -2)
      scene.add(rim)

      const pivot = new THREE.Group()
      scene.add(pivot)

      const applySize = () => {
        const w = Math.max(1, wrap.clientWidth)
        const h = Math.max(1, wrap.clientHeight)
        renderer.setSize(w, h, false)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
      }
      applySize()

      const resizeObserver = new ResizeObserver(applySize)
      resizeObserver.observe(wrap)

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const pointer = new THREE.Vector2(0, 0)
      const onPointerMove = (e: PointerEvent) => {
        pointer.x = (e.clientX / window.innerWidth - 0.5) * 2
        pointer.y = (e.clientY / window.innerHeight - 0.5) * 2
      }
      if (!reducedMotion) {
        window.addEventListener('pointermove', onPointerMove, { passive: true })
      }

      const clock = new THREE.Clock()
      let mixer: THREE.AnimationMixer | null = null
      let model: THREE.Object3D | null = null
      let raf = 0

      const tick = () => {
        raf = requestAnimationFrame(tick)
        const dt = Math.min(clock.getDelta(), 0.05)
        if (mixer) mixer.update(dt)
        if (!reducedMotion) {
          const targetY = pointer.x * 0.5
          const targetX = pointer.y * 0.12
          pivot.rotation.y += (targetY - pivot.rotation.y) * 0.06
          pivot.rotation.x += (targetX - pivot.rotation.x) * 0.06
        }
        renderer.render(scene, camera)
      }

      const loader = new GLTFLoader()
      loader.load(
        '/models/mentor-robot.glb',
        (gltf) => {
          if (disposed) return
          model = gltf.scene
          pivot.add(model)

          if (fullBody) {
            camera.position.set(0, 2.55, 9.1)
            camera.lookAt(0, 2.5, 0)
          } else {
            camera.position.set(0, 3.55, 4.6)
            camera.lookAt(0, 3.38, 0)
          }

          mixer = new THREE.AnimationMixer(model)
          const actions = new Map<string, THREE.AnimationAction>()
          for (const clip of gltf.animations) {
            actions.set(clip.name, mixer.clipAction(clip))
          }

          const idle = actions.get('Idle')
          const wave = actions.get('Wave')
          if (idle && wave) {
            wave.setLoop(THREE.LoopOnce, 1)
            wave.clampWhenFinished = false
            wave.reset().play()
            const onFinished = (e: { action: THREE.AnimationAction }) => {
              if (e.action !== wave) return
              mixer?.removeEventListener('finished', onFinished)
              wave.stop()
              idle.reset().fadeIn(0.4).play()
            }
            mixer.addEventListener('finished', onFinished)
          } else if (idle) {
            idle.reset().play()
          } else {
            for (const action of actions.values()) action.reset().play()
          }

          tick()
          setStatus('ready')
        },
        undefined,
        () => {
          if (!disposed) setStatus('error')
        }
      )

      cleanup = () => {
        cancelAnimationFrame(raf)
        resizeObserver.disconnect()
        if (!reducedMotion) window.removeEventListener('pointermove', onPointerMove)
        if (mixer) mixer.stopAllAction()
        if (model) {
          model.traverse((obj) => {
            const mesh = obj as THREE.Mesh
            if (mesh.geometry) mesh.geometry.dispose()
            const mat = mesh.material as THREE.Material | THREE.Material[] | undefined
            if (Array.isArray(mat)) mat.forEach((m) => m.dispose())
            else if (mat) mat.dispose()
          })
        }
        renderer.dispose()
        if (renderer.domElement.parentElement === wrap) {
          wrap.removeChild(renderer.domElement)
        }
      }
    }

    if (desktopMq.matches) start()
    const onMqChange = () => {
      if (desktopMq.matches) start()
    }
    desktopMq.addEventListener('change', onMqChange)

    return () => {
      disposed = true
      desktopMq.removeEventListener('change', onMqChange)
      if (cleanup) cleanup()
    }
  }, [fullBody])

  if (status === 'error') {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-2xl bg-primary/10',
          className
        )}
      >
        <Bot className="h-8 w-8 text-primary" />
      </div>
    )
  }

  return (
    <div className={cn('relative', className)}>
      <div
        aria-hidden
        className={cn(
          'absolute inset-1 blur-xl',
          fullBody ? 'rounded-3xl bg-primary/10' : 'rounded-full bg-primary/20'
        )}
      />
      <div
        ref={wrapRef}
        aria-hidden
        className={cn(
          'relative h-full w-full transition-opacity duration-500',
          status === 'ready' ? 'opacity-100' : 'opacity-0'
        )}
      />
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Bot className="h-8 w-8 animate-pulse text-primary" />
        </div>
      )}
    </div>
  )
}
