import React, { useEffect, useState } from 'react'
import {
	Box,
	CircularProgress,
	Grid,
	IconButton,
	Typography,
	useTheme,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import Image from 'next/image'
import { FileInfo } from '@/types/file'
import { useChatContext } from '@/hooks/asesor-humano/useChatContext'
import { useInputInfo } from '@/hooks/asesor-humano/useInputInfo'

interface Props {
	closePreview: () => void
	footerHeight: number | undefined
	uploading: boolean
}

export const FilePreview = ({
	footerHeight,
	closePreview,
	uploading,
}: Props) => {
	const { getInputInfo } = useInputInfo()
	const { asesorHumano } = useTheme()
	const { drawerWidth, conversationId } = useChatContext()
	const [previewFile, setPreviewFile] = useState<FileInfo | null>(null)

	useEffect(() => {
		const file = getInputInfo(conversationId)
		if (file) {
			setPreviewFile(file.previewFile)
		} else {
			setPreviewFile(null)
		}
	}, [conversationId])

	return (
		<Box
			sx={{
				position: 'fixed',
				bottom: footerHeight,
				bgcolor: 'white',
				width: `calc(100% - ${drawerWidth}px)`,
			}}
		>
			<Grid container>
				<Grid
					item
					xs
					textAlign="end"
					p={1}
					bgcolor={asesorHumano.header.background}
					color={asesorHumano.header.color}
				>
					<IconButton onClick={closePreview} color="inherit">
						<CloseIcon />
					</IconButton>
				</Grid>

				{previewFile && (
					<Grid
						item
						xs={12}
						textAlign="center"
						py={2}
						sx={{ position: 'relative' }}
					>
						{/* Imagen */}
						<Image
							src={previewFile.icon}
							width={150}
							height={150}
							alt={previewFile.name}
							style={{ opacity: uploading ? 0.5 : 1 }}
						/>

						{/* Circular Progress centrado sobre la imagen */}
						{uploading && (
							<Box
								sx={{
									position: 'absolute',
									top: '50%',
									left: '50%',
									transform: 'translate(-50%, -50%)',
								}}
							>
								<CircularProgress size={60} thickness={4} />
							</Box>
						)}

						<Typography variant="body1">
							{previewFile.name}
						</Typography>
					</Grid>
				)}
			</Grid>
		</Box>
	)
}
