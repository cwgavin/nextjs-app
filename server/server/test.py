from io import BytesIO
from logging import Logger
import torch
from torchvision import models
from torchvision.models.resnet import ResNeXt50_32X4D_Weights
import os
from PIL import Image
from torchvision import transforms


ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.environ["TORCH_HOME"] = f"{ROOT_DIR}/models"


def predict(imageBytes: BytesIO, logger: Logger):
    resnet = models.resnext50_32x4d(weights=ResNeXt50_32X4D_Weights.DEFAULT)
    resnet.eval()

    # img = Image.open(f"{ROOT_DIR}/test_images/dumbbell.jpg")
    img = Image.open(imageBytes)
    transform = transforms.Compose(
        [
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ]
    )

    img_t = transform(img)
    batch_t = torch.unsqueeze(img_t, 0)  # type: ignore

    out = resnet(batch_t)
    _, indices = torch.sort(out, descending=True)
    percentage = torch.nn.functional.softmax(out, dim=1)[0] * 100

    with open(f"{ROOT_DIR}/imagenet_classes.txt") as f:
        labels = [line.strip() for line in f.readlines()]

    return [(labels[idx], percentage[idx].item()) for idx in indices[0][:5]]
